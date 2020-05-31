import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { REQUEST_START } from '../global/global.actionTypes';
import { requestError, showNotification, hideNotification, requestEnd, requestStart } from '../global/global.actions';
import { logout, updateUserOk } from '../auth/auth.actions';
import { UPDATE_USER_START } from '../auth/auth.actionTypes';
import users from '../../api/protected/users';
import { CRUD_UPDATE_START } from './crud.actionTypes';
import { crudUpdateOk } from './crud.actions';
import useNotify from '../../utils/notifications';
function* checkError(error: any) {
    if (error.statusCode === 401 || error.statusCode === 403) {
        yield put(logout())
    }
    error.message = error.message || error.error || "An error occurred"
    return error
}
function* crudUpdate(updateData: any) {
    yield put(requestStart())
    const nId = Date.now()
    try {
        switch (updateData.meta.resource) {
            case 'users': {
                const user = yield call(users.updateResource, updateData)
                yield put(showNotification({ key: nId, type: 'success', message: `User updated.` }))
                yield put(updateUserOk(user))
            }
        }
    } catch (error) {
        yield checkError(error)
        yield put(showNotification({ key: nId, type: 'error', message: error.message }))
        yield put(requestError({ error }))
    }
    yield put(requestEnd())
    yield delay(5000)
    yield put(hideNotification(nId))
}

function* crudSaga() {
    yield takeEvery(CRUD_UPDATE_START, (action: any) =>
        crudUpdate(action.payload))
}

export default crudSaga