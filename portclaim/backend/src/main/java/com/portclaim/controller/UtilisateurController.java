package com.portclaim.controller;

import com.portclaim.entity.Role;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {
    private final UtilisateurRepository repo;

    @GetMapping("/agents")
    // On utilise hasRole('ADMIN') car il cherche automatiquement le préfixe "ROLE_"
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<List<Utilisateur>> listAgents() {
        // Retourne uniquement les utilisateurs qui ont le rôle AGENT pour Portnet
        return ResponseEntity.ok(repo.findByRole(Role.AGENT));
    }
}