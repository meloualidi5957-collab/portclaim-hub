import * as T from '../actions/types';
const initial = { items: [], loading: false, error: null };
export default function reclamationReducer(state = initial, action) {
  switch (action.type) {
    case T.FETCH_RECLAMATIONS_REQUEST: return { ...state, loading: true, error: null };
    case T.FETCH_RECLAMATIONS_SUCCESS: return { ...state, loading: false, items: action.payload };
    case T.FETCH_RECLAMATIONS_FAILURE: return { ...state, loading: false, error: action.error };
    case T.CREATE_RECLAMATION_SUCCESS: return { ...state, items: [action.payload, ...state.items] };
    case T.UPDATE_STATUT_SUCCESS:
      return { ...state, items: state.items.map(r => r.id === action.payload.id ? action.payload : r) };
    default: return state;
  }
}
