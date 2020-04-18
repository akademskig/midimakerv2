import { createSelector } from "reselect"
import { AuthState } from './auth.types';

const selectAuth = (state: { auth: AuthState }) => state.auth

export const isAuthenticated = createSelector(
    [selectAuth],
    (auth) => !!auth.accessToken
)

export const selectUser = createSelector(
    [selectAuth],
    (auth) => auth.user
)