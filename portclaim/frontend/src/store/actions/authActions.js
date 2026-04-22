import * as T from './types';
export const loginRequest = (payload) => ({ type: T.LOGIN_REQUEST, payload });
export const loginSuccess = (payload) => ({ type: T.LOGIN_SUCCESS, payload });
export const loginFailure = (error) => ({ type: T.LOGIN_FAILURE, error });
export const logout = () => ({ type: T.LOGOUT });
