package com.portclaim.repository;

import com.portclaim.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Récupérer tout l'historique trié par date décroissante (le plus récent en premier)
    List<AuditLog> findAllByOrderByDateActionDesc();
}