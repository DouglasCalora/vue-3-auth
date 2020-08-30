import { createStore } from 'vuex'
import auth from '../store/auth'
import post from '../store/post'

export default createStore({
  modules: {
    auth,
    post
  }
})
