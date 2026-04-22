package com.portclaim.dto;
import com.portclaim.entity.Role;
import lombok.*;

public class AuthDtos {
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest { private String email; private String motDePasse; }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token; private Long userId; private String email;
        private String nom; private String prenom; private Role role;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        private String nom; private String prenom; private String email;
        private String motDePasse; private Role role; private String entreprise; private String telephone;
    }
}
