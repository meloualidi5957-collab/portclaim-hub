package com.portclaim.repository;

import com.portclaim.entity.Reclamation;
import com.portclaim.entity.Statut; // Nouvel import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDateTime; // Nouvel import
import java.util.List; // Nouvel import


public interface ReclamationRepository extends JpaRepository<Reclamation, Long>, JpaSpecificationExecutor<Reclamation> {
    
    // --- SYSTEME D'ESCALADE AUTOMATIQUE ---
    // Recherche toutes les réclamations ayant un statut précis (EN_COURS) 
    // et dont la dernière modification est antérieure à une date limite.
    List<Reclamation> findByStatutAndDateModificationBefore(Statut statut, LocalDateTime limite);
    List<Reclamation> findByClientId(Long clientId);
    
    // --- NOUVEAU : Pour trouver les tickets affectés à un agent ---
    List<Reclamation> findByAgentId(Long agentId);
}