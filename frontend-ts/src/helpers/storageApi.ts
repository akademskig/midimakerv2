import { LocalStorage } from 'quasar'

class StorageApi {
    CURRENT_USER = 'currentUser'

    setCurrentUser (currentUser: CurrentUser) {
      LocalStorage.set(this.CURRENT_USER, currentUser)
    }

    getCurrentUser (): CurrentUser | null {
      return LocalStorage.getItem(this.CURRENT_USER) ? LocalStorage.getItem(this.CURRENT_USER) : null
    }

    removeCurrentUser () {
      LocalStorage.remove(this.CURRENT_USER)
    }
}

export default new StorageApi()
