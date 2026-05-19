from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="PortClaim Hub - Service IA")

# Chargement du modèle NLP (Zéro-Shot) pour l'analyse en Français
print("Chargement du modèle d'IA (mDeBERTa) en cours...")
classifier = pipeline(
    "zero-shot-classification", 
    model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli"
)
print("Modèle d'IA chargé avec succès !")

# Mots-clés critiques spécifiques à l'écosystème de PortNet
mots_critiques = ["bloqué", "blocage", "retenu", "scellé", "interdit", "bloquée"]
contextes_urgents = ["casablanca", "port", "douane", "conteneur", "marchandise", "navire"]

# Modèle de données attendu depuis ton Backend Spring Boot
class ClaimRequest(BaseModel):
    text: str

@app.post("/analyze-priority")
def analyze_priority(request: ClaimRequest):
    texte_clean = request.text.lower()
    
    # --- 1. RÈGLE MÉTIER PORTUAIRE (Priorité Maximale : CRITIQUE) ---
    a_blocage = any(mot in texte_clean for mot in mots_critiques)
    a_contexte = any(ctx in texte_clean for ctx in contextes_urgents)
    
    if a_blocage and a_contexte:
        return {
            "priority": "CRITIQUE",
            "method": "Regle_Metier_Portuaire"
        }
        
    # --- 2. ANALYSE PAR INTELLIGENCE ARTIFICIELLE (NLP) ---
    labels_possibles = ["Urgent", "Normal", "Faible"]
    template_hypothese = "Le niveau d'urgence de cette réclamation est {}."
    
    resultat = classifier(
        request.text,
        candidate_labels=labels_possibles,
        hypothesis_template=template_hypothese
    )
    
    meilleur_label = resultat['labels'][0]
    
    # Correspondance exacte avec tes Enums Java Spring Boot
    mapping_priorite = {
        "Urgent": "HAUTE",
        "Normal": "NORMALE",
        "Faible": "BASSE"
    }
    
    return {
        "priority": mapping_priorite.get(meilleur_label, "NORMALE"),
        "method": "IA_NLP_Model"
    }