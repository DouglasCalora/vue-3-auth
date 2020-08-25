
export default {
  namespaced: true,
  state: {
    test: 'Ué',
    isAuth: false,
    token: null,
    error: {}
  },

  getters: {
    test: ({ test }) => test
  }
}
