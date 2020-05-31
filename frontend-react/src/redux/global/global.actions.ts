import { REQUEST_START, REQUEST_ERROR, SHOW_NOTIFICATION, HIDE_NOTIFICATION, REQUEST_END } from './global.actionTypes';

export const requestStart = () => ({
    type: REQUEST_START,
})
export const requestError = (error: any) => ({
    type: REQUEST_ERROR,
    payload: error
})

export const requestEnd = () => ({
    type: REQUEST_END,
})

export const showNotification = ({key, type, message }: {key: number, type: string, message: string }) => ({
    type: SHOW_NOTIFICATION,
    payload: {key, type, message}
})

export const hideNotification = (nId: number) => ({
    type: HIDE_NOTIFICATION,
    payload: nId
})
