import * as T from '../actions/types';
const initial = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false, error: null
};
export default function authReducer(state = initial, action) {
  switch (action.type) {
    case T.LOGIN_REQUEST: return { ...state, loading: true, error: null };
    case T.LOGIN_SUCCESS: return { ...state, loading: false, token: action.payload.token, user: action.payload };
    case T.LOGIN_FAILURE: return { ...state, loading: false, error: action.error };
    case T.LOGOUT: return { token: null, user: null, loading: false, error: null };
    default: return state;
  }
}
