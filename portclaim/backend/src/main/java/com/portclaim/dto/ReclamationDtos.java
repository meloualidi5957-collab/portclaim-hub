package com.portclaim.dto;

import com.portclaim.entity.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class ReclamationDtos {
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CreateRequest {
        private String titre; 
        private String description; 
        private String typeOperation;
        private String numeroConteneur; 
        private String navire; 
        private Priorite priorite;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class UpdateStatutRequest { 
        private Statut statut; 
    }

    // --- NOUVEAU : DTO pour la mise à jour de la priorité par l'Admin ---
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class UpdatePrioriteRequest { 
        private Priorite priorite; 
    }
    // -------------------------------------------------------------------

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class AffectationRequest { 
        private Long agentId; 
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ReponseRequest { 
        private String message; 
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReclamationView {
        private Long id; 
        private String reference; 
        private String titre; 
        private String description;
        private String typeOperation; 
        private String numeroConteneur; 
        private String navire;
        private Statut statut; 
        private Priorite priorite;
        
        private String pieceJointe; 

        private String clientNom; 
        private String agentNom;
        private LocalDateTime dateCreation; 
        private LocalDateTime dateModification;
        private Integer feedbackNote;
        private String feedbackCommentaire;
        private List<ReponseView> reponses;

        public static ReclamationView from(Reclamation r) {
            
            return ReclamationView.builder()
                .id(r.getId())
                .reference(r.getReference())
                .titre(r.getTitre())
                .description(r.getDescription())
                .typeOperation(r.getTypeOperation())
                .numeroConteneur(r.getNumeroConteneur())
                .navire(r.getNavire())
                .statut(r.getStatut())
                .priorite(r.getPriorite())
                .pieceJointe(r.getPieceJointe()) 
                .clientNom(r.getClient() != null ? r.getClient().getPrenom() + " " + r.getClient().getNom() : null)
                .agentNom(r.getAgent() != null ? r.getAgent().getPrenom() + " " + r.getAgent().getNom() : null)
                .dateCreation(r.getDateCreation())
                .dateModification(r.getDateModification())
                // --- NOUVEAU : Mapping automatique de la note et du commentaire si le feedback existe ---
                .feedbackNote(r.getFeedback() != null ? r.getFeedback().getNote() : null)
                .feedbackCommentaire(r.getFeedback() != null ? r.getFeedback().getCommentaire() : null)
                // ---------------------------------------------------------------------------------------
                .build();
        }
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReponseView {
        private Long id; 
        private String message; 
        private String auteurNom; 
        private LocalDateTime dateCreation;
        
        public static ReponseView from(Reponse r) {
            return ReponseView.builder()
                .id(r.getId())
                .message(r.getMessage())
                .auteurNom(r.getAuteur().getPrenom() + " " + r.getAuteur().getNom())
                .dateCreation(r.getDateCreation())
                .build();
        }
    }
}