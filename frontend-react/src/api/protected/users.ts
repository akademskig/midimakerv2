import Axios from 'axios'
import { getToken } from '../utils/index';
class Users {
    baseUrl = `http://localhost:4000`
    accessToken = null
    get axios() {
        const accessToken = getToken()
        const axios = Axios.create({
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        return axios
    }
    updateResource = async ({ meta, data }: { meta: any, data: any }) => {
        switch (meta.endpoint) {
            case '/': {
                return this.updateUser(data)
            }
            case 'changePassword': {
                return this.changePassword(data)
            }
            default:
                return Promise.reject(null)
        }

    }
    updateUser = async ({ userId, email, username }: { userId: string, email?: string; username?: string }) => {
        const body = Object.assign({}, email && { email }, username && { username })
        const res = await this.axios.put(`${this.baseUrl}/users/${userId}`, body)
        return res.data
    }
    changePassword = async ({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string; newPassword: string }) => {
            const res = await this.axios.put(`${this.baseUrl}/users/change_password/${userId}`, { oldPassword, newPassword })
            return res.data
      
    }

}
const users = new Users()
export default users



export const useUpdateUser = () => users.updateUser
export const useChangePassword = () => users.changePassword