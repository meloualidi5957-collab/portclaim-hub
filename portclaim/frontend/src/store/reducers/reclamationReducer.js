import * as T from '../actions/types';

// Ajout de currentDetail pour stocker la réclamation sélectionnée
const initial = { items: [], currentDetail: null, loading: false, error: null };

export default function reclamationReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_RECLAMATIONS_REQUEST: 
      return { ...state, loading: true, error: null };
    case T.FETCH_RECLAMATIONS_SUCCESS: 
      return { ...state, loading: false, items: action.payload };
    case T.FETCH_RECLAMATIONS_FAILURE: 
      return { ...state, loading: false, error: action.error };

    // --- NOUVEAU : Gestion de la récupération des détails ---
    case T.FETCH_RECLAMATION_DETAILS_REQUEST:
      return { ...state, loading: true, error: null, currentDetail: null }; // On vide l'ancien au chargement
    case T.FETCH_RECLAMATION_DETAILS_SUCCESS:
      return { ...state, loading: false, currentDetail: action.payload };
    case T.FETCH_RECLAMATION_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.error };
    // --------------------------------------------------------

    case T.CREATE_RECLAMATION_SUCCESS: 
      return { ...state, items: [action.payload, ...state.items] };
    
    case T.UPDATE_STATUT_SUCCESS:
      return { 
        ...state, 
        items: state.items.map(r => r.id === action.payload.id ? action.payload : r),
        // Si on est sur la page de détails et qu'on change le statut, ça met à jour l'affichage en temps réel !
        currentDetail: state.currentDetail?.id === action.payload.id ? action.payload : state.currentDetail
      };
      
    default: return state;
  }
}