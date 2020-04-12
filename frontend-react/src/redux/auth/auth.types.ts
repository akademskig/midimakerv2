export const LOGIN_START = "LOGIN_START"
export const LOGIN_OK = "LOGIN_OK"
export const LOGIN_ERROR = "LOGIN_ERROR"
export const SET_TOKEN = "SET_TOKEN"
export const REMOVE_TOKEN = "REMOVE_TOKEN"
export const LOGOUT = "LOGOUT"


export type AuthState = {
    user: {
        username: string,
        email: string,
        accessToken: string
    }
}