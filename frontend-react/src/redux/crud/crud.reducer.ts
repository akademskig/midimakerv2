import { FETCH_LIST_OK } from './crud.actionTypes';
const initialState = {
}

function crudReducer(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case FETCH_LIST_OK: {
            const  data = action.payload
            return {
                ...data,
                ...state,
            }
        }
        default: return state
    }
}


export default crudReducer