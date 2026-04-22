# PortClaim Hub - Plateforme de gestion des réclamations portuaires

## Stack
- Backend: Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA + JpaSpecificationExecutor
- DB: MySQL (XAMPP) - jdbc:mysql://localhost:3306/reclamations_db (root, sans mot de passe)
- Frontend: React 18, Redux, Redux Saga, Material UI 5

## Démarrage
### Backend
1. Démarrer XAMPP (MySQL sur 3306). La DB `reclamations_db` est créée automatiquement.
2. `cd backend && ./mvnw spring-boot:run` (ou `mvn spring-boot:run`)
3. API : http://localhost:8080

### Frontend
1. `cd frontend && npm install`
2. `npm start` → http://localhost:3000

## Comptes test
- admin@port.com / admin123
- agent@port.com / agent123
- client@port.com / client123

## Endpoints principaux
- POST /api/auth/login
- POST /api/auth/register
- GET /api/reclamations?statut=&priorite=
- POST /api/reclamations
- PATCH /api/reclamations/{id}/statut
- PATCH /api/reclamations/{id}/affectation (ADMIN)
- POST /api/reclamations/{id}/reponses
- GET /api/users?role=AGENT (ADMIN)
