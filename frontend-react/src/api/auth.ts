import Axios from 'axios'
const registerURL = 'http://localhost:4000/auth/register'
const signInUrl = 'http://localhost:4000/auth/signin'


export const register = async ({ email, password, username }: { email: string; password: string; username: string }) => {
  try {
    const res = await Axios.post(registerURL, { email, password, username },
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

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    const res = await Axios.post(signInUrl, { email, password },
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
export const logout = () => {
  localStorage.removeItem('access_token');
  return Promise.resolve();
}
// called when the API returns an error
export const checkError = (error: any) => {
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
export const checkAuth = () => {
  return localStorage.getItem('access_token')
    ? Promise.resolve()
    : Promise.reject();
}
