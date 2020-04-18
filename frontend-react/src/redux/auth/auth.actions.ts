import { LOGIN_START, LOGIN_OK, LOGOUT, SET_TOKEN, REMOVE_TOKEN, UPDATE_OK } from './auth.types';


export const loginStart = (userCredentials: {email: string,password: string}) => ({
    type: LOGIN_START,
    payload: userCredentials
})

export const loginOk = (user: any) => ({
    type: LOGIN_OK,
    payload: {
        user
    }
})
export const updateOk = (user: any) => ({
    type: UPDATE_OK,
    payload: {
        user
    }
})

export const logout = () => ({
    type: LOGOUT,
})

export const setToken = (token: string) => ({
    type: SET_TOKEN,
    payload: {
        token
    }
})

export const removeToken = () => ({
    type: REMOVE_TOKEN,
})