import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, TextField, Typography, Box } from '@mui/material';
import axios from '../api/client'; // <-- On utilise ton client sécurisé !

const FeedbackModal = ({ open, onClose, reclamationId, onSubmited }) => {
    const [note, setNote] = useState(5);
    const [commentaire, setCommentaire] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(false);
        try {
            // Appel de l'API Backend que nous venons de créer
            
            //  Ligne corrigée :
            await axios.post(`/reclamations/${reclamationId}/feedback`, {    
                note: note,
                commentaire: commentaire
            });
            
            if (onSubmited) onSubmited();
            onClose(); // Fermer la boîte de dialogue
        } catch (error) {
            alert(`Erreur lors de l'envoi de l'évaluation : ${error.response?.data || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Votre avis nous intéresse ! ⭐
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2, gap: 2 }}>
                    <Typography component="legend">Comment évaluez-vous le traitement de votre réclamation ?</Typography>
                    <Rating
                        name="feedback-stars"
                        value={note}
                        onChange={(event, newValue) => setNote(newValue)}
                        size="large"
                    />
                    <TextField
                        label="Votre commentaire (Optionnel)"
                        multiline
                        rows={4}
                        fullWidth
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        placeholder="Ex: Service rapide et efficace, merci !"
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    Plus tard
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                    {loading ? 'Envoi...' : 'Soumettre mon avis'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackModal;