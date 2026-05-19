package com.portclaim.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1) @Max(5)
    @Column(nullable = false)
    private int note; // Note de 1 à 5 étoiles

    @Column(length = 1000)
    private String commentaire;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reclamation_id", nullable = false, unique = true)
    private Reclamation reclamation; // Lié à une seule réclamation

    private LocalDateTime dateCreation;
}