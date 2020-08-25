<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
      <button @click="signOut">Logout</button>

      {{ user }}
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
    // const { replace } = useRouter()

    const user = computed(() => store.getters['auth/user'])

    function signOut () {
      return store.dispatch('auth/logout', async function (commit) {
        location.href = '/logout'
        // commit('removeUser')
      })
    }

    return {
      user,
      signOut
    }
  }
}
</script>
