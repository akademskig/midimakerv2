import Axios from 'axios'

class Auth {
    baseUrl = `http://localhost:4000`
    registerURL ='http://localhost:4000/auth/register'
    signInUrl = 'http://localhost:4000/auth/signin'
    accessToken = null
    register = async ({ email, password, username }: {email: string; password: string; username: string}) => {
      try {
        const res = await Axios.post(this.registerURL, { email, password, username },
          { headers: {
            'Content-Type': 'application/json'
          } })
        this.accessToken = res.data.access_token
        return res.data
      } catch (err) {
        const errRes = err.response ? err.response.data : 'An error occurred'
        console.error(JSON.stringify(errRes))
        throw errRes
      }
    }

    signIn = async ({ email, password }: {email: string; password: string}) => {
      try {
        const res = await Axios.post(this.signInUrl, { email, password },
          { headers: {
            'Content-Type': 'application/json'
          } })
        return res.data
      } catch (err) {
        const errRes = err.response ? err.response.data : 'An error occurred'
        console.error(JSON.stringify(errRes))
        throw errRes
      }
    }

    updateUser = async ({ userId, email, username }: {userId: string, email: string; username: string}) => {
      try {
        const res = await Axios.put(`${this.baseUrl}/users/${userId}`, { email, username },
          { headers: {
            'Content-Type': 'application/json'
          } })
        return res.data
      } catch (err) {
        const errRes = err.response ? err.response.data : 'An error occurred'
        console.error(JSON.stringify(errRes))
        throw errRes
      }
    }
    changePassword = async ({userId, oldPassword, newPassword }: {userId: string, oldPassword: string; newPassword: string}) => {
      try {
        const res = await Axios.put(`${this.baseUrl}/users/changePassword${userId}`, { oldPassword, newPassword },
          { headers: {
            'Content-Type': 'application/json'
          } })
        return res.data
      } catch (err) {
        const errRes = err.response ? err.response.data : 'An error occurred'
        console.error(JSON.stringify(errRes))
        throw errRes
      }
    }

}
const auth = new Auth()
export default auth



export const useLogin = () => auth.signIn
export const useRegister = () => auth.register