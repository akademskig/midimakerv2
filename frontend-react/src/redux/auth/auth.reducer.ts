import { LOGIN_START, LOGIN_OK, LOGOUT } from './auth.types';
const initialState = {
    accessToken: "",
    loading: false,
    user: null
}

function authReducer(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case LOGIN_OK: {
            const { user } = action.payload
            const {accessToken,...userData} = user
            return {
                ...state,
                user: userData,
                accessToken,
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
                user: null
            }
        }
        default: return state
    }
}


export default authReducer