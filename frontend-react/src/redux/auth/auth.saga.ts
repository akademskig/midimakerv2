import { call, put, takeEvery } from 'redux-saga/effects';
import auth from '../../api/auth';
import { LOGIN_START, LOGIN_ERROR } from './auth.types';
import { loginOk } from './auth.actions';


/**
 * Fetches book collection on app startup.
 */
function* login(userCredentials: {email: string, password: string}) {
   try {
      console.log(userCredentials)
      const user = yield call(auth.signIn, userCredentials);
      yield put(loginOk(user));
   } catch (error) {
      yield put({type: LOGIN_ERROR, error});
   }
}

function* authSaga() {
   yield takeEvery(LOGIN_START, (action:any) =>
   { console.log(action); 
      return login(action.payload)})
}

export default authSaga