package com.portclaim.controller;

import com.portclaim.dto.ReclamationDtos.*;
import com.portclaim.dto.FeedbackRequest; // --- NOUVEAU ---
import com.portclaim.entity.*;
import com.portclaim.service.ReclamationService;
import com.portclaim.service.FeedbackService; // --- NOUVEAU ---
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid; // --- NOUVEAU ---
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
public class ReclamationController {
    private final ReclamationService service;
    private final FeedbackService feedbackService; // --- NOUVEAU ---

    /**
     * Route pour la page d'Analyses
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getDashboardStats());
    }

    @GetMapping
    public ResponseEntity<List<ReclamationView>> list(
            @RequestParam(required = false) Statut statut,
            @RequestParam(required = false) Priorite priorite,
            @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.list(statut, priorite, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReclamationView> get(@PathVariable Long id, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.get(id, user));
    }

    /**
     * CRÉATION : Support du format Multipart (JSON + Fichier)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReclamationView> create(
            @RequestPart("reclamation") CreateRequest req, 
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.create(req, file, user));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<ReclamationView> updateStatut(@PathVariable Long id,
            @RequestBody UpdateStatutRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.updateStatut(id, req.getStatut(), user));
    }

    @PatchMapping("/{id}/priorite")
    public ResponseEntity<ReclamationView> updatePriorite(@PathVariable Long id,
            @RequestBody UpdatePrioriteRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.updatePriorite(id, req.getPriorite(), user));
    }

    @PatchMapping("/{id}/affectation")
    public ResponseEntity<ReclamationView> affecter(@PathVariable Long id,
            @RequestBody AffectationRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.affecter(id, req.getAgentId(), user));
    }

    @PostMapping("/{id}/reponses")
    public ResponseEntity<ReponseView> ajouterReponse(@PathVariable Long id,
            @RequestBody ReponseRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.addReponse(id, req.getMessage(), user));
    }

    // --- NOUVEAU : Endpoint pour la soumission du feedback déplacé ici ---
    @PostMapping("/{id}/feedback")
    public ResponseEntity<String> ajouterFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest req,
            @AuthenticationPrincipal Utilisateur user) {
        feedbackService.soumettreFeedback(id, req, user);
        return ResponseEntity.ok("Merci pour votre retour ! Votre évaluation a été enregistrée.");
    }
    // ---------------------------------------------------------------------
}