import Axios from 'axios'

export class Auth {
  baseUrl = `http://localhost:4000`
  registerURL = 'http://localhost:4000/auth/register'
  signInUrl = 'http://localhost:4000/auth/signin'
  accessToken = null
  register = async ({ email, password, username }: { email: string; password: string; username: string }) => {
    try {
      const res = await Axios.post(this.registerURL, { email, password, username },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      return res.data
    } catch (err) {
      const errRes = err.response ? err.response.data : 'An error occurred'
      console.error(JSON.stringify(errRes))
      throw errRes
    }
  }

  signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await Axios.post(this.signInUrl, { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      this.accessToken = res.data.access_token
      return res.data
    } catch (err) {
      const errRes = err.response ? err.response.data : 'An error occurred'
      console.error(JSON.stringify(errRes))
      throw errRes
    }
  }
  logout = () => {
    localStorage.removeItem('access_token');
    return Promise.resolve();
  }
  // called when the API returns an error
  checkError = (error: any) => {
    const { status } = error
    if (status === 401 || status === 403) {
      return Promise.reject('Your session has expired');
    }
    const errRes = error.response ? error.response.data : 'An error occurred'
    if (errRes.statusCode === 401) {
      error.message = "Access restricted."
      throw error
    }
    console.error(JSON.stringify(errRes))
    throw errRes
  }
  // called when the user navigates to a new location, to check for authentication
  checkAuth = () => {
    return localStorage.getItem('access_token')
      ? Promise.resolve()
      : Promise.reject();
  }
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions = () => Promise.resolve()
}
const auth = new Auth()
export default auth



export const useLogin = () => auth.signIn
export const useRegister = () => auth.register