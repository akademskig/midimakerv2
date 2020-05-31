import {combineReducers} from "redux"
import authReducer from "./auth/auth.reducer"
import globalReducer from './global/global.reducer';

export default combineReducers({
    auth: authReducer,
    global: globalReducer
})