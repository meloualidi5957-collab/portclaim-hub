package com.portclaim.controller;

import com.portclaim.dto.AuthDtos.*;
import com.portclaim.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            // Si tout va bien, on renvoie les informations et le Token JWT (Code 200)
            return ResponseEntity.ok(service.login(req));
        } catch (RuntimeException e) {
            // Si les identifiants sont invalides, on renvoie une erreur 401 propre
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        // Optionnel : tu peux aussi ajouter un try/catch ici si tu veux gérer 
        // l'erreur "Email déjà utilisé" de la même manière !
        return ResponseEntity.ok(service.register(req));
    }
}