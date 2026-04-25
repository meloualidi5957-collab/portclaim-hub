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

    public AuthResponse login(LoginRequest req) {
        Utilisateur u = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        
        if (!u.getActif()) throw new RuntimeException("Compte désactivé");
        
        if (!encoder.matches(req.getMotDePasse(), u.getMotDePasse()))
            throw new RuntimeException("Identifiants invalides");
            
        String token = jwt.generateToken(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
        
        return AuthResponse.builder().token(token).userId(u.getId()).email(u.getEmail())
            .nom(u.getNom()).prenom(u.getPrenom()).role(u.getRole()).build();
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email déjà utilisé");

        Utilisateur u = Utilisateur.builder()
            .nom(req.getNom())
            .prenom(req.getPrenom())
            .email(req.getEmail())
            .cin(req.getCin()) // --- NOUVEAU : Sauvegarde du CIN ---
            .motDePasse(encoder.encode(req.getMotDePasse()))
            .role(req.getRole() == null ? com.portclaim.entity.Role.CLIENT : req.getRole())
            .entreprise(req.getEntreprise())
            .telephone(req.getTelephone())
            .actif(true)
            .build();

        userRepo.save(u);

        // NOUVEAU : On retourne juste une confirmation sans forcer la connexion.
        // Comme ça, l'Administrateur qui crée le compte n'est pas déconnecté de sa session !
        return AuthResponse.builder().email(u.getEmail()).build();
    }
}