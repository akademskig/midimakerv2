import { LOGIN_START, LOGIN_OK, LOGOUT, UPDATE_OK } from './auth.types';
const initialState = {
    loading: false,
    user: null,
    accessToken: null
}

function authReducer(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case LOGIN_OK: {
            const { user } = action.payload
            const {access_token,...userData} = user
            return {
                ...state,
                user: userData,
                accessToken: access_token,
                loading: false,
            }
        }
        case LOGIN_START: {
            return {
                ...state,
                loading: true
            }
        }
        case LOGOUT: {
            return {
                ...state,
                accessToken:null,
                user: null
            }
        }
        case UPDATE_OK: {
            const { user } = action.payload
            const {access_token,...userData} = user
            return {
                ...state,
                user: userData,
                loading: false,
            }
        }
        default: return state
    }
}


export default authReducer