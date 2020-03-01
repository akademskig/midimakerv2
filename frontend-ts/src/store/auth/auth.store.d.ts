type RegisterPayload = {
    email: string;
    password: string;
    username: string;
}

type SignInPayload = {
    email: string;
    password: string;
}

type AuthState = {
    currentUser: CurrentUser | null;
}

type CurrentUser = {
    email: string;
    username: string;
    accessToken: string;
}
export {
  RegisterPayload,
  SignInPayload,
  AuthState,
  CurrentUser
}
