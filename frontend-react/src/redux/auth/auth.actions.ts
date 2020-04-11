import { LOGIN_START, LOGIN_OK, LOGOUT, SET_TOKEN, REMOVE_TOKEN } from './auth.types';


export const loginStart = (userCredentials: {email: string,password: string}) => ({
    type: LOGIN_START,
    payload: userCredentials
})

export const loginOk = (user: []) => ({
    type: LOGIN_OK,
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