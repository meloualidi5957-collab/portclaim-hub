package com.portclaim.controller;

import com.portclaim.dto.ReclamationDtos.*;
import com.portclaim.entity.*;
import com.portclaim.service.ReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
public class ReclamationController {
    private final ReclamationService service;

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

    @PostMapping
    public ResponseEntity<ReclamationView> create(@RequestBody CreateRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.create(req, user));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<ReclamationView> updateStatut(@PathVariable Long id,
            @RequestBody UpdateStatutRequest req, @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(service.updateStatut(id, req.getStatut(), user));
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
}