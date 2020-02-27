import auth from '../../api/auth'

const state = {
  currentUser: null
  // your code
}

function mutations (state) {
  return {
    'REGISTER': (user) => {
      state.currentUser = user
    }

  }
  // your code
}
const actions = {
  async  register ({ commit }, payload) {
    const { user } = await auth.register(payload)
    if (user) {
      commit('REGISTER', user)
    }
  }
}
// your code

function getters (/* state */) {
  // your code
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
