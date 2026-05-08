import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/client';
import * as T from '../actions/types';

function* fetchWorker(action) {
  try {
    const params = action.payload || {};
    const res = yield call(api.get, '/reclamations', { params });
    yield put({ type: T.FETCH_RECLAMATIONS_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.FETCH_RECLAMATIONS_FAILURE, error: e.message });
  }
}

function* fetchDetailsWorker(action) {
  try {
    const id = action.payload;
    const res = yield call(api.get, `/reclamations/${id}`);
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_FAILURE, error: e.message });
  }
}

function* createWorker(action) {
  try {
    const res = yield call(api.post, '/reclamations', action.payload);
    yield put({ type: T.CREATE_RECLAMATION_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.CREATE_RECLAMATION_FAILURE, error: e.message });
  }
}

// --- MODIFIÉ : On ajoute le rechargement automatique de la page ---
function* updateStatutWorker(action) {
  try {
    const { id, statut } = action.payload;
    const res = yield call(api.patch, `/reclamations/${id}/statut`, { statut });
    yield put({ type: T.UPDATE_STATUT_SUCCESS, payload: res.data });
    
    // On recharge les détails pour que le nouveau statut s'affiche immédiatement
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_REQUEST, payload: id });
  } catch (e) {
    console.error("Erreur mise à jour statut", e);
    yield put({ type: T.UPDATE_STATUT_FAILURE, error: e.message });
    alert("Erreur lors du changement de statut.");
  }
}
// -----------------------------------------------------------------

function* updatePrioriteWorker(action) {
  try {
    const { id, priorite } = action.payload;
    const res = yield call(api.patch, `/reclamations/${id}/priorite`, { priorite });
    yield put({ type: 'UPDATE_PRIORITE_SUCCESS', payload: res.data });
    
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_REQUEST, payload: id });
  } catch (e) {
    console.error("Erreur mise à jour priorité", e);
    yield put({ type: 'UPDATE_PRIORITE_FAILURE', error: e.message });
    alert("Erreur lors de la modification. Vérifiez que vous avez les droits Admin.");
  }
}

function* addReponseWorker(action) {
  try {
    const { reclamationId, message } = action.payload;
    const res = yield call(api.post, `/reclamations/${reclamationId}/reponses`, { message });
    yield put({ type: 'ADD_REPONSE_SUCCESS', payload: res.data });
    
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_REQUEST, payload: reclamationId });
  } catch (e) {
    console.error("Erreur envoi réponse", e);
    yield put({ type: 'ADD_REPONSE_FAILURE', error: e.message });
    alert("Erreur lors de l'envoi du message.");
  }
}

export default function* reclamationSaga() {
  yield takeLatest(T.FETCH_RECLAMATIONS_REQUEST, fetchWorker);
  yield takeLatest(T.CREATE_RECLAMATION_REQUEST, createWorker);
  yield takeLatest(T.UPDATE_STATUT_REQUEST, updateStatutWorker);
  yield takeLatest(T.FETCH_RECLAMATION_DETAILS_REQUEST, fetchDetailsWorker);
  yield takeLatest('UPDATE_PRIORITE_REQUEST', updatePrioriteWorker);
  yield takeLatest('ADD_REPONSE_REQUEST', addReponseWorker);
}