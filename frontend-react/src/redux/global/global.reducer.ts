import { REQUEST_START, REQUEST_ERROR, SHOW_NOTIFICATION, HIDE_NOTIFICATION, REQUEST_END } from './global.actionTypes';
const initialState = {
    loading: false,
    error: null,
    response: '',
    notifications: []
}

function globalReducer(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case REQUEST_START: {
            return {
                ...state,
                loading: true
            }
        }
        case REQUEST_ERROR: {
            const {error} = action.payload 
            return {
                ...state,
                error,
                loading: false
            }
        }
        case REQUEST_END: {
            return {
                ...state,
                loading: false
            }
        }
        case SHOW_NOTIFICATION: {
            return {
                ...state,
                notifications: [ ...state.notifications, action.payload]
            }
        }
        case HIDE_NOTIFICATION: {
            const {nId} = action.payload 
            console.log(nId)
            return {
                ...state,
                notifications: state.notifications.filter((n: any)=> n.key !== action.payload)
            }
        }
        default: return state
    }
}


export default globalReducer