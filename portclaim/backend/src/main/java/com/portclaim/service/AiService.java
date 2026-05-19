package com.portclaim.service;

import com.portclaim.dto.AiPriorityRequest;
import com.portclaim.dto.AiPriorityResponse;
import com.portclaim.entity.Priorite;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    private final String AI_SERVICE_URL = "http://localhost:8000/analyze-priority";
    private final String CHATBOT_URL = "http://localhost:8000/chat"; // --- NOUVEAU ---
    private final RestTemplate restTemplate = new RestTemplate();

    public Priorite analyserPriorite(String titre, String description) {
        try {
            String texteAAnalyser = titre + ". " + description;
            AiPriorityRequest request = new AiPriorityRequest(texteAAnalyser);
            AiPriorityResponse response = restTemplate.postForObject(AI_SERVICE_URL, request, AiPriorityResponse.class);

            if (response != null && response.getPriority() != null) {
                return Priorite.valueOf(response.getPriority());
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'appel au service IA: " + e.getMessage());
        }
        return Priorite.NORMALE;
    }

    // ==========================================
    // NOUVEAU : GESTION DU CHATBOT
    // ==========================================
    
    // Classes internes pour mapper les données JSON avec FastAPI
    public static class ChatRequest {
        private String question;
        private String context;
        
        public ChatRequest(String question, String context) { 
            this.question = question; 
            this.context = context; 
        }
        
        // --- NOUVEAU : Getters indispensables pour que Spring Boot crée le JSON ---
        public String getQuestion() { return question; }
        public String getContext() { return context; }
    }

    public static class ChatResponse {
        private String reply;
        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
    }

    public String interrogerChatbot(String question, String contexteClient) {
        try {
            ChatRequest request = new ChatRequest(question, contexteClient);
            ChatResponse response = restTemplate.postForObject(CHATBOT_URL, request, ChatResponse.class);
            return (response != null && response.getReply() != null) ? response.getReply() : "Désolé, je n'ai pas pu générer de réponse.";
        } catch (Exception e) {
            System.err.println("Erreur appel Chatbot Python : " + e.getMessage());
            return "Désolé, l'assistant IA est actuellement indisponible.";
        }
    }
}