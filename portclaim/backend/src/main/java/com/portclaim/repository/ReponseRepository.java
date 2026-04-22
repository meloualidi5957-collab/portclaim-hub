package com.portclaim.repository;
import com.portclaim.entity.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByReclamationIdOrderByDateCreationAsc(Long reclamationId);
}
