import axios from 'axios'

export default {
  namespaced: true,
  state: {
    user: {},
    isAuth: false,
    token: null,
    error: {}
  },

  getters: {
    user: ({ user }) => user,
    isAuth: ({ isAuth }) => isAuth
  },

  mutations: {
    setUser (state, user) {
      user = { token: user.token, user: user.user }

      state.user = user
      state.token = user.token
      state.isAuth = user

      axios.defaults.headers = { Authorization: `bearer ${user.token}` }
    },

    removeUser (state) {
      state.user = {}
      state.token = ''
      state.isAuth = false

      axios.defaults.headers = {}
      localStorage.clear()
    },

    setError (state, error) {
      state.error = error
    }
  },

  actions: {
    userValidation ({ commit }) {
      const hasUser = localStorage.getItem('user')

      if (hasUser) {
        return commit('setUser', JSON.parse(hasUser))
      }
    },

    async login ({ commit }, payload) {
      try {
        const user = await axios.post('/login', payload)

        localStorage.setItem('user', JSON.stringify(user.data))
        commit('setUser', user.data)

        return user
      } catch (error) {
        commit('setError', error)
        return Promise.reject(error)
      }
    },

    logout ({ commit }, beforeLogout) {
      if (beforeLogout) {
        return beforeLogout(commit)
      }

      return commit('removeUser') && Promise.resolve()
    }
  }
}
