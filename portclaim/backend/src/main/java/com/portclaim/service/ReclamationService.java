package com.portclaim.service;

import com.portclaim.dto.ReclamationDtos.*;
import com.portclaim.entity.*;
import com.portclaim.repository.*;
import com.portclaim.specification.ReclamationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReclamationService {
    private final ReclamationRepository repo;
    private final UtilisateurRepository userRepo;
    private final ReponseRepository reponseRepo;

    /**
     * Liste les réclamations selon le rôle et les filtres
     */
    public List<ReclamationView> list(Statut statut, Priorite priorite, Utilisateur current) {
        Specification<Reclamation> spec = Specification
            .where(ReclamationSpecification.hasStatut(statut))
            .and(ReclamationSpecification.hasPriorite(priorite));
        
        if (current.getRole() == Role.CLIENT) 
            spec = spec.and(ReclamationSpecification.hasClient(current.getId()));
        else if (current.getRole() == Role.AGENT) 
            spec = spec.and(ReclamationSpecification.hasAgent(current.getId()));
            
        return repo.findAll(spec).stream().map(ReclamationView::from).toList();
    }

    /**
     * Récupère une réclamation spécifique avec ses réponses
     */
    public ReclamationView get(Long id, Utilisateur current) {
        Reclamation r = repo.findById(id).orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        checkAccess(r, current);
        ReclamationView v = ReclamationView.from(r);
        v.setReponses(reponseRepo.findByReclamationIdOrderByDateCreationAsc(id).stream().map(ReponseView::from).toList());
        return v;
    }

    /**
     * CRÉATION : Correction de l'erreur SQL "type_operation cannot be null"
     */
    @Transactional
    public ReclamationView create(CreateRequest req, Utilisateur client) {
        Reclamation r = Reclamation.builder()
            .titre(req.getTitre())
            .description(req.getDescription())
            // FIX : On assigne le titre comme type d'opération pour éviter l'erreur SQL
            .typeOperation(req.getTitre()) 
            .priorite(req.getPriorite() == null ? Priorite.NORMALE : req.getPriorite())
            .reference("PORT-" + System.currentTimeMillis()) 
            .statut(Statut.OUVERTE)
            .client(client)
            .dateCreation(LocalDateTime.now())
            .dateModification(LocalDateTime.now())
            // Valeurs par défaut pour éviter d'autres erreurs "NOT NULL" en base
            .navire("Non spécifié")
            .numeroConteneur("N/A")
            .build();
            
        return ReclamationView.from(repo.save(r));
    }

    /**
     * Mise à jour du statut par un Agent ou Admin
     */
    @Transactional
    public ReclamationView updateStatut(Long id, Statut nouveau, Utilisateur current) {
        Reclamation r = repo.findById(id).orElseThrow();
        if (current.getRole() == Role.CLIENT) throw new RuntimeException("Action non autorisée");
        
        r.setStatut(nouveau);
        if (nouveau == Statut.RESOLUE) r.setDateResolution(LocalDateTime.now());
        r.setDateModification(LocalDateTime.now());
        
        return ReclamationView.from(repo.save(r));
    }

    /**
     * Affectation d'un agent par l'Admin
     */
    @Transactional
    public ReclamationView affecter(Long id, Long agentId, Utilisateur current) {
        if (current.getRole() != Role.ADMIN) throw new RuntimeException("Action réservée à l'administrateur");
        
        Reclamation r = repo.findById(id).orElseThrow();
        Utilisateur agent = userRepo.findById(agentId).orElseThrow(() -> new RuntimeException("Agent introuvable"));
            
        if (agent.getRole() != Role.AGENT) throw new RuntimeException("L'utilisateur choisi n'est pas un agent");
        
        r.setAgent(agent);
        if (r.getStatut() == Statut.OUVERTE) {
            r.setStatut(Statut.EN_COURS);
        }
        r.setDateModification(LocalDateTime.now());
        
        return ReclamationView.from(repo.save(r));
    }

    /**
     * Ajout d'un message dans le fil de discussion
     */
    @Transactional
    public ReponseView addReponse(Long id, String message, Utilisateur auteur) {
        Reclamation r = repo.findById(id).orElseThrow();
        checkAccess(r, auteur);
        Reponse rep = Reponse.builder()
            .reclamation(r)
            .auteur(auteur)
            .message(message)
            .dateCreation(LocalDateTime.now())
            .build();
        return ReponseView.from(reponseRepo.save(rep));
    }

    /**
     * Vérification de sécurité pour l'accès aux données
     */
    private void checkAccess(Reclamation r, Utilisateur u) {
        if (u.getRole() == Role.ADMIN) return;
        if (u.getRole() == Role.CLIENT && r.getClient().getId().equals(u.getId())) return;
        if (u.getRole() == Role.AGENT && r.getAgent() != null && r.getAgent().getId().equals(u.getId())) return;
        throw new RuntimeException("Accès refusé");
    }
}
