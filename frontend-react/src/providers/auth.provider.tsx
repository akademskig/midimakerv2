
import React, { createContext, ReactElement, useState, SetStateAction, useMemo, Dispatch, useEffect, useCallback } from 'react'
import { cacheToken, cacheUser, getToken, getUser } from '../api/utils'

interface IAuthProvider  {
    children: ReactElement | ReactElement[]
}

interface IAuthProviderContextValue {
    user: TUser | null,
    accessToken: string
    setAuthData: Dispatch<React.SetStateAction<any | null>>,
    isAuth: boolean
}

export type TUser = {
    id: string,
    username: string,
    email: string,
    role: string
} 

const initialValue = {
    user: null,
    accessToken: '',
    setAuthData: ((v: SetStateAction<any | null>) => (value: any | null) => value),
    isAuth: false
}

export const AuthCtx = createContext<IAuthProviderContextValue>(initialValue)

export default function AuthProvider({ children }: IAuthProvider): JSX.Element {

    const [user, setUser] = useState<TUser | null>(null)
    const [accessToken, setAccessToken] = useState(getToken())
    const [isAuth, setIsAuth] = useState(Boolean(accessToken))

    const setAuthData = useCallback(
        (authData) => {
            const { user, accessToken } = authData
            user && setUser(user)
            accessToken && setAccessToken(accessToken)
            accessToken && cacheToken(accessToken)
            user && cacheUser(user)
        },
        [ setUser, setAccessToken ]
    )

    useEffect(() => {
        if(!accessToken){
            return setIsAuth(false)
        }
        if(!user){
            setUser(getUser())
        }
        setIsAuth(true)
    }, [setIsAuth, accessToken, user])

    const ctxValue = useMemo(() => ({
        user,
        setAuthData,
        accessToken,
        isAuth,
    }), [user, setAuthData, accessToken, isAuth])

    return (
        <AuthCtx.Provider value={ctxValue}>
            { children }
        </AuthCtx.Provider>
    )
}

