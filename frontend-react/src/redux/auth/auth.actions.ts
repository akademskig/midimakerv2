import { LOGIN_START, LOGIN_OK, LOGOUT, SET_TOKEN, REMOVE_TOKEN, UPDATE_USER_OK, UPDATE_USER_START } from './auth.actionTypes';


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
export const updateUserStart = (user: any) => ({
    type: UPDATE_USER_START,
    payload: 
        user
})
export const updateUserOk = (user: any) => ({
    type: UPDATE_USER_OK,
    payload:{
        user,
        notification: 'User updated successfully'
}})
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