import Axios from 'axios'
import { getToken } from '../utils/index';
const instance = Axios.create({
    
})
class Users {
    baseUrl = `http://localhost:4000`
    accessToken = null
    axios : any
    constructor (){
        const accessToken  = getToken()

        this.axios = Axios.create({
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

    }
    updateUser = async ({ userId, email, username }: { userId: string, email: string; username: string }) => {
        try {
            const res = await this.axios.put(`${this.baseUrl}/users/${userId}`, { email, username })
            return res.data
        } catch (err) {

            const errRes = err.response ? err.response.data : 'An error occurred'
            if (errRes.statusCode === 401) {
                err.message = "Access restricted."
                throw err
            }
            console.log(errRes)
            console.error(JSON.stringify(errRes))
            throw errRes
        }
    }
    changePassword = async ({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string; newPassword: string }) => {
        try {
            const res = await this.axios.put(`${this.baseUrl}/auth/changePassword/${userId}`, { oldPassword, newPassword })
            return res.data
        } catch (err) {
            const errRes = err.response ? err.response.data : 'An error occurred'
            console.error(JSON.stringify(errRes))
            throw errRes
        }
    }

}
const users = new Users()
export default users



export const useUpdateUser = () => users.updateUser
export const useChangePassword = () => users.changePassword