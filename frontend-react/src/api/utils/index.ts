export const getToken = () => {
    const storage = localStorage.getItem('persist:root')
    if (storage) {
        const s = JSON.parse(storage)
        return JSON.parse(s.auth).accessToken
    }
    return ''
}