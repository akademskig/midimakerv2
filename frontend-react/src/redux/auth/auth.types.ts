export type AuthState = {
    user: {
        id: string
        username: string,
        email: string,
        accessToken: string
    },
    accessToken: string,
    notification: string
}