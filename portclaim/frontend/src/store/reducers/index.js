import { combineReducers } from 'redux';
import auth from './authReducer';
import reclamations from './reclamationReducer';
export default combineReducers({ auth, reclamations });
