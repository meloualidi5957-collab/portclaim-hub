package com.portclaim.config;
import com.portclaim.entity.*;
import com.portclaim.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UtilisateurRepository userRepo;
    private final ReclamationRepository recRepo;
    private final PasswordEncoder enc;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;
        Utilisateur admin = userRepo.save(Utilisateur.builder().nom("Admin").prenom("Super")
            .email("admin@port.com").motDePasse(enc.encode("admin123")).role(Role.ADMIN).actif(true).build());
        Utilisateur agent = userRepo.save(Utilisateur.builder().nom("Martin").prenom("Pierre")
            .email("agent@port.com").motDePasse(enc.encode("agent123")).role(Role.AGENT).actif(true).build());
        Utilisateur client = userRepo.save(Utilisateur.builder().nom("Dupont").prenom("Marie")
            .email("client@port.com").motDePasse(enc.encode("client123")).role(Role.CLIENT)
            .entreprise("Maritime SA").actif(true).build());

        recRepo.save(Reclamation.builder().titre("Conteneur endommagé")
            .description("Le conteneur MSCU1234567 présente des dégâts importants.")
            .typeOperation("DECHARGEMENT").numeroConteneur("MSCU1234567").navire("MSC OSCAR")
            .priorite(Priorite.HAUTE).statut(Statut.OUVERTE).client(client).build());
        recRepo.save(Reclamation.builder().titre("Retard de livraison")
            .description("Marchandise non livrée dans les délais convenus.")
            .typeOperation("LIVRAISON").priorite(Priorite.NORMALE)
            .statut(Statut.EN_COURS).client(client).agent(agent).build());
    }
}
