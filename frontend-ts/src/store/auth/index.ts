import auth from '../../api/auth'
import Vue from 'vue'
import { Commit } from 'vuex/types'
import storageApi from 'src/helpers/storageApi'

const state = {
  currentUser: storageApi.getCurrentUser()
}
const mutations = {
  REGISTER (state: AuthState, user: CurrentUser) {
    state.currentUser = user
  },
  SIGN_IN (state: AuthState, user: CurrentUser) {
    state.currentUser = user
  },
  LOG_OUT (state: AuthState) {
    Vue.set(state, 'currentUser', null)
  }
}
const actions = {
  register ({ commit }: {commit: Commit}, payload: RegisterPayload) {
    return auth.register(payload)
      .then((user) => {
        commit('REGISTER', user)
      })
  },
  signIn ({ commit }: {commit: Commit}, payload: SignInPayload) {
    return auth.signIn(payload)
      .then((user) => {
        storageApi.setCurrentUser(user)
        commit('SIGN_IN', user)
        return user.username
      })
  },
  removeUser ({ commit }: {commit: Commit}) {
    storageApi.removeCurrentUser()
    commit('LOG_OUT')
  }
}

const getters = {
  getCurrentUser (state: AuthState) {
    return state.currentUser
  },
  getCurrentUserLanguageId (state: AuthState) {
    return state.currentUser ? state.currentUser.languageId : null
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
