import { createStore } from 'vuex'
import test from '../store/test'
import auth from '../store/auth'

export default createStore({
  modules: {
    test,
    auth
  }
})
