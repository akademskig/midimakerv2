import Axios from 'axios'

class Auth {
    registerURL ='http://localhost:3000/auth/register'
    signInUrl = 'http://localhost:3000/auth/signin'
    register = async ({ email, password, username }: {email: string; password: string; username: string}) => {
      try {
        const res = await Axios.post(this.registerURL, { email, password, username },
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
}

export default new Auth()
