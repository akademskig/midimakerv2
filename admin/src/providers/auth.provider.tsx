
const signInUrl = 'http://localhost:4000/auth/signin'
class AuthProvider {
  accessToken!: string
  login = async ({ email, password }: { email: string; password: string }) => {
    const request = new Request(signInUrl, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => response.json())
      .then((response) => {
      
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return Promise.reject(response.message)
        }
        if(response.role !== 'admin'){
          return Promise.reject('Only admin users are allowed access!')
        }
        const { access_token } = response
        localStorage.setItem('access_token', access_token)
      });
  }
  // called when the user clicks on the logout button
  logout = () => {
    localStorage.removeItem('access_token');
    return Promise.resolve();
  }
  // called when the API returns an error
  checkError = ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('access_token');
      return Promise.reject('Your session has expired');
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location, to check for authentication
  checkAuth = () => {
    return localStorage.getItem('access_token')
      ? Promise.resolve()
      : Promise.reject();
  }
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions = () => Promise.resolve()
};

export default new AuthProvider()