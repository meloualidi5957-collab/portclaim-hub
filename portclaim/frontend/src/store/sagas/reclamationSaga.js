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

// --- NOUVEAU : Worker pour récupérer les détails via l'ID ---
function* fetchDetailsWorker(action) {
  try {
    const id = action.payload;
    // On appelle l'API de ton ReclamationService.java (get par ID)
    const res = yield call(api.get, `/reclamations/${id}`);
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.FETCH_RECLAMATION_DETAILS_FAILURE, error: e.message });
  }
}
// ------------------------------------------------------------

function* createWorker(action) {
  try {
    const res = yield call(api.post, '/reclamations', action.payload);
    yield put({ type: T.CREATE_RECLAMATION_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.CREATE_RECLAMATION_FAILURE, error: e.message });
  }
}

function* updateStatutWorker(action) {
  try {
    const { id, statut } = action.payload;
    const res = yield call(api.patch, `/reclamations/${id}/statut`, { statut });
    yield put({ type: T.UPDATE_STATUT_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.UPDATE_STATUT_FAILURE, error: e.message });
  }
}

export default function* reclamationSaga() {
  yield takeLatest(T.FETCH_RECLAMATIONS_REQUEST, fetchWorker);
  yield takeLatest(T.CREATE_RECLAMATION_REQUEST, createWorker);
  yield takeLatest(T.UPDATE_STATUT_REQUEST, updateStatutWorker);
  
  // --- NOUVEAU : On écoute la demande de détails ---
  yield takeLatest(T.FETCH_RECLAMATION_DETAILS_REQUEST, fetchDetailsWorker);
}