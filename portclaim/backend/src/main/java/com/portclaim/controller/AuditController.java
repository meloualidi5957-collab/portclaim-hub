package com.portclaim.controller;

import com.portclaim.entity.AuditLog;
import com.portclaim.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        // L'accès à cette méthode est 100% protégé par le SecurityConfig.
        // Si l'exécution arrive jusqu'ici, il est mathématiquement garanti 
        // que la requête provient d'un utilisateur avec le rôle ADMIN.
        
        List<AuditLog> logs = auditLogRepository.findAllByOrderByDateActionDesc();
        return ResponseEntity.ok(logs);
    }
}