import Axios from 'axios'

class Auth {
    apiURL ='http://localhost:3000/auth/register'
    register = async ({ email, password, username }: {email: string; password: string; username: string}) => {
      const res = await Axios.post(this.apiURL, { email, password, username },
        { headers: {
          'Content-Type': 'application/json'
        } })
      if (res.status === 200) {
        return res.data
      } else {
        return null
      }
    }
}

export default new Auth()
