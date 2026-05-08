package com.portclaim.service;

import com.portclaim.entity.AuditLog;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(String action, String detail, Utilisateur utilisateur, String cible) {
        // Gestion de l'utilisateur (s'il n'est pas connecté, par ex lors d'un échec de login)
        String nomUtilisateur = (utilisateur != null) 
                ? utilisateur.getPrenom() + " " + utilisateur.getNom() 
                : "Système / Utilisateur Anonyme";
                
        Long idUtilisateur = (utilisateur != null) ? utilisateur.getId() : null;

        AuditLog log = AuditLog.builder()
                .action(action)
                .detail(detail)
                .utilisateurId(idUtilisateur)
                .utilisateurNom(nomUtilisateur)
                .cible(cible)
                .dateAction(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }
}