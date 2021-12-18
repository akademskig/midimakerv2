import parseError from "../utils/parseError"

const url = `http://localhost:4000/users`


export const updateUserRequest = async ({
  userId,
  email,
  username,
}: {
  userId: string
  email?: string
  username?: string
}) => {
  const body = JSON.stringify(
    Object.assign({}, email && { email }, username && { username })
  )
  return fetch(`${url}/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      throw parseError(error)
    })
}

export const changePasswordRequest = async ({
  userId,
  oldPassword,
  newPassword,
}: {
  userId: string
  oldPassword: string
  newPassword: string
}) => {
  const body = JSON.stringify({ oldPassword, newPassword })
  return fetch(`${url}/change-password/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      throw parseError(error)
    })
}
