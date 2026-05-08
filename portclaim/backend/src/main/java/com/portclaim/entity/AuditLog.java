package com.portclaim.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'action effectuée (ex: "LOGIN", "LOGOUT", "CREATION_RECLAMATION", "MISE_A_JOUR_STATUT")
    @Column(nullable = false)
    private String action;

    // Le détail précis de l'action (ex: "L'agent s'est connecté avec succès", "Passage du statut à REJETEE")
    @Column(nullable = false, length = 500)
    private String detail;

    // L'ID de l'utilisateur qui a fait l'action (peut être nullable pour les tentatives de connexion échouées par exemple)
    @Column(name = "utilisateur_id")
    private Long utilisateurId;
    
    // Le nom complet ou l'email (très important de le stocker en dur au cas où l'utilisateur est supprimé de la base plus tard)
    @Column(name = "utilisateur_nom")
    private String utilisateurNom;

    // La cible de l'action (ex: "SYSTEME", "RECLAMATION: PORT-168453...", "UTILISATEUR: ID-5")
    @Column(name = "cible")
    private String cible;

    @Column(name = "date_action", nullable = false)
    private LocalDateTime dateAction;
}