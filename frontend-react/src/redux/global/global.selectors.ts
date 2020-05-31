import { createSelector } from "reselect"

const selectGlobal = (state: { global: any }) => state.global

export const getError = createSelector(
    [selectGlobal],
    (global) => global.error
)

export const selectNotification = createSelector(
    [selectGlobal],
    (global) => global.notifications
)