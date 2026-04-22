package com.portclaim.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateurs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Utilisateur {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nom;
    @Column(nullable = false) private String prenom;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String motDePasse;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Role role;
    private String entreprise;
    private String telephone;
    @Column(nullable = false) private Boolean actif = true;
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.actif == null) this.actif = true;
    }
}
