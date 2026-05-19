import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from '../api/client'; 
import { useSelector } from 'react-redux';

export default function ChatWidget() {
    const user = useSelector(state => state.auth.user);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de PortNet. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, open]);

    // --- MODIFICATION : On affiche le chatbot si l'utilisateur est connecté, peu importe son rôle ! ---
    if (!user) return null;
    // -------------------------------------------------------------------------------------------------

    const handleSend = async () => {
        if (!message.trim()) return;

        const userText = message;
        setMessage('');
        setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
        setLoading(true);

        try {
            const response = await axios.post('/reclamations/chatbot', { question: userText });
            setChatHistory(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { sender: 'bot', text: 'Désolé, je rencontre des difficultés de connexion au serveur.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <Fab 
                color="primary" 
                aria-label="chat" 
                onClick={() => setOpen(!open)}
                sx={{ position: 'fixed', bottom: 24, right: 24, bgcolor: '#002b5c', '&:hover': { bgcolor: '#004080' }, zIndex: 1000 }}
            >
                {open ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {open && (
                <Paper 
                    elevation={6} 
                    sx={{
                        position: 'fixed', bottom: 90, right: 24, width: 350, height: 500,
                        display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', zIndex: 1000
                    }}
                >
                    <Box sx={{ bgcolor: '#002b5c', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Assistant PortNet IA</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#f8fafc' }}>
                        {chatHistory.map((msg, index) => (
                            <Box key={index} sx={{
                                display: 'flex', gap: 1,
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%'
                            }}>
                                {msg.sender === 'bot' && <SmartToyIcon sx={{ color: '#002b5c', fontSize: 20, mt: 0.5 }} />}
                                <Box sx={{
                                    bgcolor: msg.sender === 'user' ? '#0ea5e9' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#334155',
                                    p: 1.5, borderRadius: 2, border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
                                <SmartToyIcon sx={{ color: '#002b5c', fontSize: 20 }} />
                                <CircularProgress size={20} sx={{ color: '#002b5c' }} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white' }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Posez votre question..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                        <IconButton onClick={handleSend} disabled={!message.trim() || loading} color="primary" sx={{ bgcolor: '#f0f4f8' }}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
}