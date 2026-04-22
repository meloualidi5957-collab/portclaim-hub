package com.portclaim.specification;
import com.portclaim.entity.*;
import org.springframework.data.jpa.domain.Specification;

public class ReclamationSpecification {
    public static Specification<Reclamation> hasStatut(Statut s) {
        return (r, q, cb) -> s == null ? cb.conjunction() : cb.equal(r.get("statut"), s);
    }
    public static Specification<Reclamation> hasPriorite(Priorite p) {
        return (r, q, cb) -> p == null ? cb.conjunction() : cb.equal(r.get("priorite"), p);
    }
    public static Specification<Reclamation> hasClient(Long id) {
        return (r, q, cb) -> id == null ? cb.conjunction() : cb.equal(r.get("client").get("id"), id);
    }
    public static Specification<Reclamation> hasAgent(Long id) {
        return (r, q, cb) -> id == null ? cb.conjunction() : cb.equal(r.get("agent").get("id"), id);
    }
}
