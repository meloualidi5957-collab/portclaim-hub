package com.portclaim.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reponses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reponse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 4000) private String message;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "reclamation_id", nullable = false)
    private Reclamation reclamation;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() { this.dateCreation = LocalDateTime.now(); }
}
