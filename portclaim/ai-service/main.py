from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import google.generativeai as genai # --- NOUVEAU ---

app = FastAPI(title="PortClaim Hub - Service IA")

# ==========================================
# CONFIGURATION GEMINI (CHATBOT)
# ==========================================
# REMPLACE CETTE VALEUR PAR TA VRAIE CLÉ API GOOGLE
GEMINI_API_KEY = "AIzaSyB8eov0RRDitAnDadnA0SIyrc6k-qWUGf4"
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash')
# ==========================================
# CONFIGURATION DeBERTa (CLASSIFICATION)
# ==========================================
print("Chargement du modèle d'IA (mDeBERTa) en cours...")
classifier = pipeline(
    "zero-shot-classification", 
    model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli"
)
print("Modèle d'IA chargé avec succès !")

mots_critiques = ["bloqué", "blocage", "retenu", "scellé", "interdit", "bloquée"]
contextes_urgents = ["casablanca", "port", "douane", "conteneur", "marchandise", "navire"]

class ClaimRequest(BaseModel):
    text: str

@app.post("/analyze-priority")
def analyze_priority(request: ClaimRequest):
    texte_clean = request.text.lower()
    
    a_blocage = any(mot in texte_clean for mot in mots_critiques)
    a_contexte = any(ctx in texte_clean for ctx in contextes_urgents)
    
    if a_blocage and a_contexte:
        return {"priority": "CRITIQUE", "method": "Regle_Metier_Portuaire"}
        
    labels_possibles = ["Urgent", "Normal", "Faible"]
    template_hypothese = "Le niveau d'urgence de cette réclamation est {}."
    
    resultat = classifier(request.text, candidate_labels=labels_possibles, hypothesis_template=template_hypothese)
    
    label_top = resultat['labels'][0]
    
    if label_top == "Urgent": return {"priority": "HAUTE", "method": "IA_mDeBERTa"}
    elif label_top == "Normal": return {"priority": "NORMALE", "method": "IA_mDeBERTa"}
    else: return {"priority": "BASSE", "method": "IA_mDeBERTa"}

# ==========================================
# NOUVEAU : ENDPOINT CHATBOT GEMINI
# ==========================================
class ChatRequest(BaseModel):
    question: str
    context: str

@app.post("/chat")
def chat_with_gemini(request: ChatRequest):
    try:
        # On construit un prompt strict pour guider l'IA
        prompt = f"""
        Tu es l'assistant virtuel intelligent du Guichet Unique PortNet.
        Ton rôle est d'aider le client de manière polie, concise et professionnelle.
        
        Voici les données strictes concernant les réclamations actuelles de ce client :
        {request.context}
        
        Question du client : "{request.question}"
        
        Règles importantes :
        - Si la question concerne l'état d'un ticket, base-toi UNIQUEMENT sur les données fournies ci-dessus.
        - Si le client n'a pas de ticket, dis-lui simplement qu'il n'a aucune réclamation en cours.
        - Si la question est générale sur le port, réponds normalement.
        - Sois bref (maximum 3 phrases).
        """
        
        response = gemini_model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        print(f"Erreur Gemini: {e}")
        return {"reply": "Désolé, mon module d'intelligence artificielle est en cours de maintenance."}