package com.portclaim.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import important

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    // L'ID de la réclamation pour la redirection dans le Frontend
    @Column(nullable = false)
    private Long reclamationId;

    @Column(nullable = false)
    private boolean lu;

    private LocalDateTime dateCreation;

    // L'utilisateur qui reçoit la notification
    // @JsonIgnore empêche la boucle infinie et l'erreur ByteBuddy lors de la conversion en JSON
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        this.lu = false;
    }
}