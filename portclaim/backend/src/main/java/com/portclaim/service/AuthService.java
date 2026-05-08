package com.portclaim.service;

import com.portclaim.dto.AuthDtos.*;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.UtilisateurRepository;
import com.portclaim.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UtilisateurRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    
    // --- NOUVEAU : Injection du service d'Audit ---
    private final AuditService auditService;

    public AuthResponse login(LoginRequest req) {
        Utilisateur u = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        
        if (!u.getActif()) throw new RuntimeException("Compte désactivé");
        
        if (!encoder.matches(req.getMotDePasse(), u.getMotDePasse()))
            throw new RuntimeException("Identifiants invalides");
            
        String token = jwt.generateToken(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
        
        // --- NOUVEAU : Log de connexion réussie ---
        auditService.logAction("LOGIN", "L'utilisateur s'est connecté au système", u, "SYSTEME");
        
        return AuthResponse.builder().token(token).userId(u.getId()).email(u.getEmail())
            .nom(u.getNom()).prenom(u.getPrenom()).role(u.getRole()).build();
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email déjà utilisé");

        Utilisateur u = Utilisateur.builder()
            .nom(req.getNom())
            .prenom(req.getPrenom())
            .email(req.getEmail())
            .cin(req.getCin()) 
            .motDePasse(encoder.encode(req.getMotDePasse()))
            .role(req.getRole() == null ? com.portclaim.entity.Role.CLIENT : req.getRole())
            .entreprise(req.getEntreprise())
            .telephone(req.getTelephone())
            .actif(true)
            .build();

        Utilisateur savedUser = userRepo.save(u);

        // --- NOUVEAU : Log de création de compte ---
        // On indique qui a été créé et avec quel rôle
        auditService.logAction(
            "CREATION_COMPTE", 
            "Nouvel utilisateur créé : " + savedUser.getNom() + " " + savedUser.getPrenom() + " (Rôle: " + savedUser.getRole() + ")", 
            savedUser, 
            "UTILISATEUR: " + savedUser.getEmail()
        );

        return AuthResponse.builder().email(savedUser.getEmail()).build();
    }

    // --- NOUVEAU : Méthode pour le Logout ---
    public void logout(Utilisateur u) {
        if (u != null) {
            auditService.logAction("LOGOUT", "L'utilisateur s'est déconnecté", u, "SYSTEME");
        }
    }
}