package com.portclaim;

import com.portclaim.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class PortClaimApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortClaimApplication.class, args);
    }

    /**
     * Script exécuté au démarrage pour réparer le mot de passe de TOUS les comptes de test.
     * Une fois que la connexion fonctionnera pour les 3, tu pourras supprimer ce bloc @Bean.
     */
    @Bean
    public CommandLineRunner reparerMotDePasse(UtilisateurRepository repo, PasswordEncoder encoder) {
        return args -> {
            // Liste des 3 comptes à réparer
            List<String> emails = List.of(
                "admin2@portnet.ma", 
                "agent.test@portnet.ma", 
                "contact@maroc-import.ma"
            );

            System.out.println("=====================================================");
            for (String email : emails) {
                repo.findByEmail(email).ifPresent(user -> {
                    // On force le hachage correct de "password123" pour chacun
                    user.setMotDePasse(encoder.encode("password123"));
                    repo.save(user);
                    System.out.println("✅ Mot de passe réparé avec succès pour : " + email);
                });
            }
            System.out.println("=====================================================");
        };
    }
}