package com.portclaim.service;

import com.portclaim.dto.ReclamationDtos.*;
import com.portclaim.entity.*;
import com.portclaim.repository.*;
import com.portclaim.specification.ReclamationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit; // Ajout pour le calcul du temps de résolution
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReclamationService {
    private final ReclamationRepository repo;
    private final UtilisateurRepository userRepo;
    private final ReponseRepository reponseRepo;
    private final NotificationRepository notificationRepo;

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de créer le dossier pour les pièces jointes.", ex);
        }
    }

    private void creerNotification(Utilisateur destinataire, String message, Long reclamationId) {
        if (destinataire != null) {
            Notification notif = Notification.builder()
                .utilisateur(destinataire)
                .message(message)
                .reclamationId(reclamationId)
                .lu(false)
                .dateCreation(LocalDateTime.now())
                .build();
            notificationRepo.save(notif);
        }
    }

    private void notifierAdmins(String message, Long reclamationId) {
        List<Utilisateur> admins = userRepo.findByRole(Role.ADMIN);
        for (Utilisateur admin : admins) {
            creerNotification(admin, message, reclamationId);
        }
    }

    /**
     * ANALYSES AVANCÉES : Statistiques détaillées pour AnalysesPage.js
     * Calcule les volumes par statut, priorité, période et temps de résolution.
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Reclamation> all = repo.findAll();
        
        // 1. Statistiques Utilisateurs
        stats.put("totalUtilisateurs", userRepo.count());
        stats.put("totalClients", userRepo.findByRole(Role.CLIENT).size());
        stats.put("totalAgents", userRepo.findByRole(Role.AGENT).size());

        // 2. Statistiques Réclamations par Statut
        stats.put("totalReclamations", all.size());
        stats.put("reclamationsOuvertes", all.stream().filter(r -> r.getStatut() == Statut.OUVERTE).count());
        stats.put("reclamationsEnCours", all.stream().filter(r -> r.getStatut() == Statut.EN_COURS).count());
        stats.put("reclamationsResolues", all.stream().filter(r -> r.getStatut() == Statut.RESOLUE).count());

        // 3. Répartition par Priorité
        Map<String, Long> parPriorite = new HashMap<>();
        for (Priorite p : Priorite.values()) {
            parPriorite.put(p.name(), all.stream().filter(r -> r.getPriorite() == p).count());
        }
        stats.put("parPriorite", parPriorite);

        // 4. Temps moyen de résolution (en heures)
        // Calcule la différence entre dateResolution et dateCreation
        double avgHours = all.stream()
                .filter(r -> r.getStatut() == Statut.RESOLUE && r.getDateResolution() != null)
                .mapToLong(r -> ChronoUnit.HOURS.between(r.getDateCreation(), r.getDateResolution()))
                .average()
                .orElse(0.0);
        stats.put("tempsMoyenResolution", Math.round(avgHours * 10.0) / 10.0);

        // 5. Évolution des 7 derniers jours (identification des pics)
        List<Map<String, Object>> evolution = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            long count = all.stream()
                .filter(r -> r.getDateCreation().toLocalDate().equals(date.toLocalDate()))
                .count();
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", date.toLocalDate().toString());
            entry.put("count", count);
            evolution.add(entry);
        }
        stats.put("evolutionData", evolution);

        return stats;
    }

    public List<ReclamationView> list(Statut statut, Priorite priorite, Utilisateur current) {
        Specification<Reclamation> spec = Specification.where(null);
        if (statut != null) spec = spec.and(ReclamationSpecification.hasStatut(statut));
        if (priorite != null) spec = spec.and(ReclamationSpecification.hasPriorite(priorite));
        
        if (current.getRole() == Role.CLIENT) {
            spec = spec.and(ReclamationSpecification.hasClient(current.getId()));
        } else if (current.getRole() == Role.AGENT) {
            spec = spec.and(ReclamationSpecification.hasAgent(current.getId()));
        }
            
        return repo.findAll(spec).stream().map(ReclamationView::from).toList();
    }

    public ReclamationView get(Long id, Utilisateur current) {
        Reclamation r = repo.findById(id).orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        checkAccess(r, current);
        ReclamationView v = ReclamationView.from(r);
        v.setReponses(reponseRepo.findByReclamationIdOrderByDateCreationAsc(id).stream().map(ReponseView::from).toList());
        return v;
    }

    private void checkAccess(Reclamation r, Utilisateur u) {
        if (u.getRole() == Role.ADMIN) return;
        if (u.getRole() == Role.CLIENT && r.getClient().getId().equals(u.getId())) return;
        if (u.getRole() == Role.AGENT && r.getAgent() != null && r.getAgent().getId().equals(u.getId())) return;
        throw new RuntimeException("Accès refusé");
    }

    @Transactional
    public ReclamationView create(CreateRequest req, MultipartFile file, Utilisateur client) {
        String fileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), this.fileStorageLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception ex) { throw new RuntimeException("Erreur stockage fichier", ex); }
        }

        Reclamation r = Reclamation.builder()
            .titre(req.getTitre()).description(req.getDescription()).typeOperation(req.getTitre())
            .priorite(req.getPriorite() == null ? Priorite.NORMALE : req.getPriorite())
            .reference("PORT-" + System.currentTimeMillis()).statut(Statut.OUVERTE)
            .pieceJointe(fileName).client(client).dateCreation(LocalDateTime.now()).dateModification(LocalDateTime.now())
            .navire("Non spécifié").numeroConteneur("N/A").build();
            
        Reclamation saved = repo.save(r);
        notifierAdmins("Nouvelle réclamation déposée : " + saved.getReference(), saved.getId());
        return ReclamationView.from(saved);
    }

    @Transactional
    public ReclamationView updateStatut(Long id, Statut nouveau, Utilisateur current) {
        Reclamation r = repo.findById(id).orElseThrow();
        if (current.getRole() == Role.CLIENT) throw new RuntimeException("Action non autorisée");
        r.setStatut(nouveau);
        if (nouveau == Statut.RESOLUE) r.setDateResolution(LocalDateTime.now());
        r.setDateModification(LocalDateTime.now());
        Reclamation saved = repo.save(r);
        creerNotification(r.getClient(), "Statut mis à jour : " + nouveau, r.getId());
        return ReclamationView.from(saved);
    }

    @Transactional
    public ReclamationView affecter(Long id, Long agentId, Utilisateur current) {
        if (current.getRole() != Role.ADMIN) throw new RuntimeException("Action réservée à l'administrateur");
        Reclamation r = repo.findById(id).orElseThrow();
        Utilisateur agent = userRepo.findById(agentId).orElseThrow(() -> new RuntimeException("Agent introuvable"));
        r.setAgent(agent);
        if (r.getStatut() == Statut.OUVERTE) r.setStatut(Statut.EN_COURS);
        r.setDateModification(LocalDateTime.now());
        Reclamation saved = repo.save(r);
        creerNotification(agent, "Nouvelle affectation : " + r.getReference(), r.getId());
        creerNotification(r.getClient(), "Agent affecté : " + agent.getPrenom(), r.getId());
        return ReclamationView.from(saved);
    }

    @Transactional
    public ReponseView addReponse(Long id, String message, Utilisateur auteur) {
        Reclamation r = repo.findById(id).orElseThrow();
        checkAccess(r, auteur);
        Reponse rep = Reponse.builder()
            .reclamation(r).auteur(auteur).message(message).dateCreation(LocalDateTime.now()).build();
        Reponse saved = reponseRepo.save(rep);
        if (auteur.getRole() == Role.CLIENT && r.getAgent() != null) {
            creerNotification(r.getAgent(), "Nouveau message client sur " + r.getReference(), r.getId());
        } else if (auteur.getRole() != Role.CLIENT) {
            creerNotification(r.getClient(), "Réponse reçue sur " + r.getReference(), r.getId());
        }
        return ReponseView.from(saved);
    }
}