<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>
      <button @click="signOut">Logout</button>
      {{ user }}
      {{ list }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'Home',

  setup () {
    const store = useStore()
    console.log('setup -> store', store)
    // const { replace } = useRouter()

    const user = computed(() => store.getters['auth/user'])
    const list = computed(() => store.getters['post/list'])

    store.dispatch('post/fetchList', {
      url: '/user/watchlist',
      errorPath: 'response.data.error',
      listPath: 'data.data'
    })

    console.log(list)

    function signOut () {
      return store.dispatch('auth/logout', async function (commit) {
        location.href = '/logout'
        // commit('removeUser')
      })
    }

    return {
      list,
      user,
      signOut
    }
  }
}
</script>
