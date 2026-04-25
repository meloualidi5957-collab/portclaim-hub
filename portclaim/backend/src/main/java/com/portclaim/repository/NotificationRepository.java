package com.portclaim.repository;

import com.portclaim.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Récupérer les notifications d'un utilisateur spécifique (Client ou Agent)
    List<Notification> findByUtilisateurIdOrderByDateCreationDesc(Long utilisateurId);
    
    // Compter combien de notifications ne sont pas encore lues (pour le badge rouge)
    long countByUtilisateurIdAndLuFalse(Long utilisateurId);
}