import { call, put, takeEvery } from 'redux-saga/effects';
import auth from '../../api/auth';
import { LOGIN_START, LOGIN_ERROR } from '../auth/auth.actionTypes';
import { loginOk } from '../auth/auth.actions';

/**
 * Fetches book collection on app startup.
 */
function* login(userCredentials: { email: string, password: string }) {
   try {
      const user = yield call(auth.signIn, userCredentials);
      yield put(loginOk(user));
   } catch (error) {
      yield put({ type: LOGIN_ERROR, error });
   }
}

function* authSaga() {
   yield takeEvery(LOGIN_START, (action: any) => login(action.payload))
}

export default authSaga