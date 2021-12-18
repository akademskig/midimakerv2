import { useCallback } from "react"
import {
  changePasswordRequest,
  updateUserRequest,
} from "../api/protected/users"
import useAuth from "./useAuth"

interface IUpdateUser {
  userId: string
  email?: string
  username?: string
}
interface IChangePassword {
  userId: string
  oldPassword: string
  newPassword: string
}
export default function useUser() {
  const { setAuthData } = useAuth()

  const updateUser = useCallback(
    async ({ userId, email, username }: IUpdateUser) => {
      const res = await updateUserRequest({ userId, email, username })
      setAuthData(res)
      return res
    },
    [setAuthData]
  )
  const changePassword = async (params: IChangePassword) => {
    const res = await changePasswordRequest(params)
    return res
  }
  return {
    updateUser,
    changePassword,
  }
}
