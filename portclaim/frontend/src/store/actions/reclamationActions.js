import * as T from './types';

export const fetchReclamations = (filters = {}) => ({ type: T.FETCH_RECLAMATIONS_REQUEST, payload: filters });

export const fetchReclamationDetails = (id) => ({ type: T.FETCH_RECLAMATION_DETAILS_REQUEST, payload: id });

export const createReclamation = (data) => ({ type: T.CREATE_RECLAMATION_REQUEST, payload: data });
export const updateStatut = (id, statut) => ({ type: T.UPDATE_STATUT_REQUEST, payload: { id, statut } });

export const updatePriorite = (id, priorite) => ({
  type: 'UPDATE_PRIORITE_REQUEST',
  payload: { id, priorite }
});

// --- NOUVEAU : Action pour envoyer un message dans le fil de discussion ---
export const addReponse = (reclamationId, message) => ({
  type: 'ADD_REPONSE_REQUEST',
  payload: { reclamationId, message }
});
// --------------------------------------------------------------------------

export const assignAgent = (reclamationId, agentId) => ({
  type: 'ASSIGN_AGENT_REQUEST',
  payload: { reclamationId, agentId }
});