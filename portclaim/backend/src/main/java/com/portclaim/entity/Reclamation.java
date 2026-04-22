package com.portclaim.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reclamations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reclamation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String reference;
    @Column(nullable = false) private String titre;
    @Column(nullable = false, length = 4000) private String description;
    @Column(nullable = false) private String typeOperation;
    private String numeroConteneur;
    private String navire;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Statut statut;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Priorite priorite;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "agent_id")
    private Utilisateur agent;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private LocalDateTime dateResolution;
    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Reponse> reponses = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
        if (this.statut == null) this.statut = Statut.OUVERTE;
        if (this.priorite == null) this.priorite = Priorite.NORMALE;
        if (this.reference == null) this.reference = "REC-" + System.currentTimeMillis();
    }

    @PreUpdate
    protected void onUpdate() { this.dateModification = LocalDateTime.now(); }
}
