import React, {
  createContext,
  ReactElement,
  useState,
  SetStateAction,
  useMemo,
  Dispatch,
  useEffect,
  useCallback,
} from "react"
import Cookies from "js-cookie"
import { TOKEN_COOKIE } from "../../constants/cookies"

interface IAuthProvider {
  children: ReactElement | ReactElement[]
}

interface IAuthProviderContextValue {
  user: TUser | null
  accessToken: string | undefined
  setAuthData: Dispatch<React.SetStateAction<any | null>>
  isAuth: () => boolean
  logout: () => void
}

export type TUser = {
  id: string
  username: string
  email: string
  role: string
}
const TOKEN_KEY = "accessToken"
const USER_KEY = "user"

export const cacheToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || ""
}
export const removeToken = () => {
  return localStorage.removeItem(TOKEN_KEY) 
}

export const cacheUser = (user: TUser) => {
  return localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY) || "")
}
const initialValue = {
  user: null,
  accessToken: "",
  setAuthData: (v: SetStateAction<any | null>) => (value: any | null) => value,
  isAuth: () => false,
}

export const AuthCtx = createContext<IAuthProviderContextValue>(
  initialValue as unknown as IAuthProviderContextValue
)

export default function AuthProvider({ children }: IAuthProvider): JSX.Element {
  const [user, setUser] = useState<TUser | null>(null)

  const setAuthData = useCallback(
    (authData) => {
      const { user, accessToken } = authData
      user && setUser(user)
      accessToken && cacheToken(accessToken)
    },
    [setUser]
  )

  const isAuth = useCallback(() => {
    return !!getToken()
  }, [])

  const accessToken = useMemo(() => {
    return getToken()
  }, [])

  const logout = useCallback(async () => {
    removeToken()
    return Promise.resolve()
  }, [])

  useEffect(() => {
    if (!user) {
      setUser(getUser())
    }
  }, [user])

  const ctxValue = useMemo(
    () => ({
      user,
      setAuthData,
      logout,
      accessToken,
      isAuth,
    }),
    [user, setAuthData, accessToken, isAuth, logout]
  )

  return <AuthCtx.Provider value={ctxValue}>{children}</AuthCtx.Provider>
}
