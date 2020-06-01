import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { requestError, showNotification, hideNotification, requestEnd, requestStart } from '../global/global.actions';
import { logout, updateUserOk } from '../auth/auth.actions';
import users from '../../api/protected/users';
import { CRUD_UPDATE_START } from './crud.actionTypes';
function* checkError(error: any) {
   let parsedError = (error.response && error.response.data) || new Error("An error occured")
    if (parsedError.statusCode === 401 || parsedError.statusCode === 403) {
        yield put(logout())
    }
    return parsedError
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
        let parsedError = yield checkError(error)
        yield put(showNotification({ key: nId, type: 'error', message: parsedError.message }))
        yield put(requestError({ error: parsedError }))
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