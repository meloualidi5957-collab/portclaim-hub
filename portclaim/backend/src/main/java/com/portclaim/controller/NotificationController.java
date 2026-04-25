package com.portclaim.controller;

import com.portclaim.entity.Notification;
import com.portclaim.entity.Utilisateur;
import com.portclaim.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository repo;

    @GetMapping
    public ResponseEntity<List<Notification>> getMesNotifications(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(repo.findByUtilisateurIdOrderByDateCreationDesc(user.getId()));
    }

    @GetMapping("/non-lues")
    public ResponseEntity<Long> countNonLues(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(repo.countByUtilisateurIdAndLuFalse(user.getId()));
    }

    @PatchMapping("/{id}/marquer-lue")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable Long id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setLu(true);
        repo.save(n);
        return ResponseEntity.ok().build();
    }
}