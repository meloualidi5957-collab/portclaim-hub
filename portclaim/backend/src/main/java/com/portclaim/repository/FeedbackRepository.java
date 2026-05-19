package com.portclaim.repository;

import com.portclaim.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Permet de vérifier si une réclamation a déjà été notée
    boolean existsByReclamationId(Long reclamationId);
}