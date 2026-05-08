package com.portclaim.controller;

import com.portclaim.dto.AuthDtos.*;
import com.portclaim.entity.Utilisateur;
import com.portclaim.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            // Si tout va bien, on renvoie les informations et le Token JWT (Code 200)[cite: 13]
            return ResponseEntity.ok(service.login(req));
        } catch (RuntimeException e) {
            // Si les identifiants sont invalides, on renvoie une erreur 401 propre[cite: 13]
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        // Optionnel : tu peux aussi ajouter un try/catch ici si tu veux gérer 
        // l'erreur "Email déjà utilisé" de la même manière ![cite: 13]
        return ResponseEntity.ok(service.register(req));
    }

    /**
     * --- NOUVEAU : Endpoint de déconnexion pour l'Audit ---
     * Cette route permet d'enregistrer le LOGOUT dans la base de données 
     * avant que le client React ne supprime son token.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal Utilisateur user) {
        service.logout(user);
        return ResponseEntity.ok(Map.of("message", "Déconnexion enregistrée avec succès"));
    }
}