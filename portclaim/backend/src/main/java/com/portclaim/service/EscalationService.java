package com.portclaim.service;

import com.portclaim.entity.*;
import com.portclaim.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EscalationService {

    private final ReclamationRepository reclamationRepo;
    private final UtilisateurRepository userRepo;
    private final NotificationRepository notificationRepo;
    private final AuditService auditService;

    /**
     * Tâche planifiée : s'exécute automatiquement TOUTES LES HEURES.
     * Note pour le test : tu pourras la modifier temporairement si besoin.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void verifierEtEscaladerTickets() {
        // Définition du seuil de 48 heures d'inactivité
        LocalDateTime limite = LocalDateTime.now().minusHours(48);

        // 1. Récupérer les réclamations "EN_COURS" non modifiées depuis 48h
        List<Reclamation> ticketsBloques = reclamationRepo.findByStatutAndDateModificationBefore(Statut.EN_COURS, limite);

        if (ticketsBloques.isEmpty()) {
            return; // Aucun ticket en souffrance, on s'arrête là
        }

        // 2. Récupérer les administrateurs pour la réaffectation
        List<Utilisateur> admins = userRepo.findByRole(Role.ADMIN);
        if (admins.isEmpty()) {
            System.err.println("[SLA] Aucun administrateur trouvé en base pour gérer l'escalade !");
            return;
        }
        Utilisateur adminPrincipal = admins.get(0); // On affecte au premier administrateur trouvé

        // 3. Traiter chaque ticket bloqué
        for (Reclamation r : ticketsBloques) {
            String nomAncienAgent = (r.getAgent() != null) ? r.getAgent().getPrenom() + " " + r.getAgent().getNom() : "Inconnu";

            // Réaffectation à l'administrateur
            r.setAgent(adminPrincipal);
            r.setDateModification(LocalDateTime.now());
            reclamationRepo.save(r);

            // Création de la notification pour l'administrateur
            Notification notif = Notification.builder()
                .utilisateur(adminPrincipal)
                .message("Alerte SLA : Le ticket " + r.getReference() + " a dépassé 48h d'inactivité. Il vous a été réaffecté.")
                .reclamationId(r.getId())
                .lu(false)
                .dateCreation(LocalDateTime.now())
                .build();
            notificationRepo.save(notif);

            // Log de l'action dans ton système d'audit existant
            auditService.logAction(
                "ESCALADE_AUTOMATIQUE", 
                "Ticket retiré à l'agent " + nomAncienAgent + " (Inactivité > 48h) et réaffecté à l'admin " + adminPrincipal.getPrenom(), 
                null, // Auteur null car c'est une action automatique du système
                "RECLAMATION: " + r.getReference()
            );
        }
    }
}