package com.portclaim.controller;

import com.portclaim.dto.AuthDtos.RegisterRequest;
import com.portclaim.entity.Role;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.UtilisateurRepository;
import com.portclaim.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurRepository repo;
    private final AuthService authService; 

    // --- TON ANCIENNE MÉTHODE (CONSERVÉE ET CORRIGÉE) ---
    @GetMapping("/agents")
    // Suppression du @PreAuthorize car la sécurité est déjà gérée par SecurityConfig
    public ResponseEntity<List<Utilisateur>> listAgents() {
        return ResponseEntity.ok(repo.findByRole(Role.AGENT));
    }

    // --- LES NOUVELLES MÉTHODES ---
    
    // 1. Récupérer la liste de TOUS les utilisateurs pour le tableau React
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        return ResponseEntity.ok(repo.findAll());
    }

    // 2. Ajouter un nouvel utilisateur (Agent ou Client) depuis le formulaire
    @PostMapping
    public ResponseEntity<?> ajouterUtilisateur(@RequestBody RegisterRequest req) {
        try {
            // On utilise le service pour hacher le mot de passe et sauvegarder
            authService.register(req);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}