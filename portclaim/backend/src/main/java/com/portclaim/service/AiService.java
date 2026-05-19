package com.portclaim.service;

import com.portclaim.dto.AiPriorityRequest;
import com.portclaim.dto.AiPriorityResponse;
import com.portclaim.entity.Priorite;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    private final String AI_SERVICE_URL = "http://localhost:8000/analyze-priority";
    private final RestTemplate restTemplate = new RestTemplate();

    public Priorite analyserPriorite(String titre, String description) {
        try {
            // On fusionne le titre et la description pour donner plus de contexte à l'IA
            String texteAAnalyser = titre + ". " + description;
            
            AiPriorityRequest request = new AiPriorityRequest(texteAAnalyser);
            
            // Appel HTTP POST vers le microservice Python FastAPI
            AiPriorityResponse response = restTemplate.postForObject(AI_SERVICE_URL, request, AiPriorityResponse.class);

            if (response != null && response.getPriority() != null) {
                // Conversion du String reçu ("CRITIQUE", "HAUTE", etc.) en Enum Java Priorite
                return Priorite.valueOf(response.getPriority());
            }
        } catch (Exception e) {
            // En cas de panne du service IA, on applique une priorité NORMALE par défaut pour ne pas bloquer l'application
            System.err.println("Erreur lors de l'appel au service IA: " + e.getMessage());
        }
        return Priorite.NORMALE;
    }
}