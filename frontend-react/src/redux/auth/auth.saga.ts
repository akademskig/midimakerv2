import { call, put, takeEvery } from 'redux-saga/effects';
import auth from '../../api/auth';
import { LOGIN_START, LOGIN_ERROR, UPDATE_USER_START } from '../auth/auth.actionTypes';
import { loginOk, updateUserOk } from '../auth/auth.actions';
import users from '../../api/protected/users';
import { requestError } from '../global/global.actions';


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