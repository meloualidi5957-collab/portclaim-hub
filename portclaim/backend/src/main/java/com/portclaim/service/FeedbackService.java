package com.portclaim.service;

import com.portclaim.dto.FeedbackRequest;
import com.portclaim.entity.Feedback;
import com.portclaim.entity.Reclamation;
import com.portclaim.entity.Statut;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.FeedbackRepository;
import com.portclaim.repository.ReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final ReclamationRepository reclamationRepo;
    private final AuditService auditService;

    @Transactional
    public void soumettreFeedback(Long reclamationId, FeedbackRequest req, Utilisateur client) {
        Reclamation r = reclamationRepo.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        // SÉCURITÉ 1 : Seul le client propriétaire du ticket peut laisser une note
        if (!r.getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à noter cette réclamation");
        }

        // SÉCURITÉ 2 : Le ticket doit être dans un état terminé (RESOLUE ou CLOTUREE)
        if (r.getStatut() != Statut.RESOLUE && r.getStatut() != Statut.CLOTUREE) {
            throw new RuntimeException("Impossible de noter une réclamation qui n'est pas encore résolue");
        }

        // SÉCURITÉ 3 : Une réclamation ne peut être notée qu'une seule fois
        if (feedbackRepo.existsByReclamationId(reclamationId)) {
            throw new RuntimeException("Cette réclamation a déjà été évaluée");
        }

        // Construction du feedback
        Feedback feedback = Feedback.builder()
                .note(req.getNote())
                .commentaire(req.getCommentaire())
                .reclamation(r)
                .dateCreation(LocalDateTime.now())
                .build();

        feedbackRepo.save(feedback);

        // Journalisation de l'évaluation dans ton système d'audit existant
        auditService.logAction(
            "SOUMISSION_FEEDBACK", 
            "Le client a évalué le traitement du ticket. Note : " + req.getNote() + "/5 Étoiles", 
            client, 
            "RECLAMATION: " + r.getReference()
        );
    }
}