import { useContext, useMemo } from 'react'
import Axios, { AxiosError } from 'axios'
import { AuthCtx } from '../../providers/auth.provider';

const baseUrl = `http://localhost:4000`

export default function useUsers() {
    const { accessToken, setAuthData } = useContext(AuthCtx)
    const axios = useMemo(() => Axios.create({
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }), [accessToken])
    const fakeError = { 
        statusCode: 400,
        message: 'Unknown error',
        error: 'Unknown'
    }
    const parseError = (error: AxiosError) => error?.response?.data || fakeError
    const updateUser = async ({ userId, email, username }: { userId: string, email?: string; username?: string }) => {
        const body = Object.assign({}, email && { email }, username && { username })
        const res = await axios.put(`${baseUrl}/users/${userId}`, body)
        setAuthData({ user: res.data })
        return res.data
    }
    const changePassword = async ({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string; newPassword: string }) => {
        return axios.put(`${baseUrl}/users/change_password/${userId}`, { oldPassword, newPassword })
            .catch(error => {throw parseError(error)})
    }
    return ({
        updateUser,
        changePassword,
    })

}
