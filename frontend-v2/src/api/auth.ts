import checkError from "./utils/checkError"

const registerURL = "http://localhost:4000/auth/register"
const signInUrl = "http://localhost:4000/auth/signin"

export const register = async ({
  email,
  password,
  username,
}: {
  email: string
  password: string
  username: string
}) => {
  return fetch(registerURL, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ email, password, username }),
  })
    .then((res) => res.json())
    .then(checkError)
}

export const signIn = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return fetch(signInUrl, {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then(checkError)
}
