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
    updateResource = async({meta, data}: { meta: any, data: any}) =>{
        console.log(meta)
        switch(meta.endpoint){
            case '/':{
                return this.updateUser(data)
            }
            case 'changePassword':{
                return this.changePassword(data)
            }
            default:
                return Promise.reject(null)
        }
       
    }
    updateUser = async ({ userId, email, username }: { userId: string, email?: string; username?: string }) => {
        const body = Object.assign({}, email && { email }, username && { username })
        try {
            const res = await this.axios.put(`${this.baseUrl}/users/${userId}`, body)
            return res.data
        } catch (err) {
            const errRes = err.response ? err.response.data : 'An error occurred'
            console.error(JSON.stringify(errRes), err.response)
            throw errRes
        }
    }
    changePassword = async ({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string; newPassword: string }) => {
        try {
            const res = await this.axios.put(`${this.baseUrl}/auth/change_password/${userId}`, { oldPassword, newPassword })
            return res.data
        } catch (err) {
            const errRes = err.response ? err.response.data : 'An error occurred'
            console.error(JSON.stringify(errRes), err.response)
            throw errRes
        }
    }

}
const users = new Users()
export default users



export const useUpdateUser = () => users.updateUser
export const useChangePassword = () => users.changePassword