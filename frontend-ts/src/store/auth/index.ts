import auth from '../../api/auth'
import Vue from 'vue'

const state = {
  currentUser: null
  // your code
}

const mutations = {
  REGISTER (state, user) {
    state.currentUser = user
  },
  SIGN_IN (state, user) {
    state.currentUser = user
  },
  LOG_OUT (state, user) {
    Vue.set(state, 'currentUser', null)
  }
  // your code
}
const actions = {
  register ({ commit }, payload) {
    return auth.register(payload)
      .then((user) => {
        commit('REGISTER', user)
      })
  },
  signIn ({ commit }, payload) {
    return auth.signIn(payload)
      .then((user) => {
        commit('SIGN_IN', user)
        return user.username
      })
  },
  removeUser ({ commit }) {
    commit('LOG_OUT')
  }
}
// your code

const getters = {
  getCurrentUser (state) {
    return state.currentUser
  }
  // your code
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
