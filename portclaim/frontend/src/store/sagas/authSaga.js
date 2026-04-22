import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api/client';
import * as T from '../actions/types';

function* loginWorker(action) {
  try {
    const res = yield call(api.post, '/auth/login', action.payload);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    yield put({ type: T.LOGIN_SUCCESS, payload: res.data });
  } catch (e) {
    yield put({ type: T.LOGIN_FAILURE, error: e.response?.data?.message || 'Erreur de connexion' });
  }
}
export default function* authSaga() {
  yield takeLatest(T.LOGIN_REQUEST, loginWorker);
}
