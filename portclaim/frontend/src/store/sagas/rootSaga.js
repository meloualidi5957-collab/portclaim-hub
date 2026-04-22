import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import reclamationSaga from './reclamationSaga';
export default function* rootSaga() {
  yield all([fork(authSaga), fork(reclamationSaga)]);
}
