import { TUser } from '../../providers/auth.provider'

const TOKEN_KEY = 'accessToken'
const USER_KEY = 'user'

export const cacheToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || ''
}

export const cacheUser = (user: TUser) => {
    return localStorage.setItem(USER_KEY, JSON.stringify(user)) 
}
export const getUser = () => {
    return JSON.parse(localStorage.getItem(USER_KEY) || '') 
}