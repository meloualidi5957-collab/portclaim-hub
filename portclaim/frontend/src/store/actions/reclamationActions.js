import * as T from './types';

export const fetchReclamations = (filters = {}) => ({ type: T.FETCH_RECLAMATIONS_REQUEST, payload: filters });

// --- NOUVEAU : Action pour récupérer les détails via l'ID ---
export const fetchReclamationDetails = (id) => ({ type: T.FETCH_RECLAMATION_DETAILS_REQUEST, payload: id });
// ------------------------------------------------------------

export const createReclamation = (data) => ({ type: T.CREATE_RECLAMATION_REQUEST, payload: data });
export const updateStatut = (id, statut) => ({ type: T.UPDATE_STATUT_REQUEST, payload: { id, statut } });
export const assignAgent = (reclamationId, agentId) => ({
  type: 'ASSIGN_AGENT_REQUEST',
  payload: { reclamationId, agentId }
});