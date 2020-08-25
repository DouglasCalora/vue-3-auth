<template>
  <div class="login">
    <form @submit.prevent="login()" class="login__box">
      <input v-model="email" type="email" />
      <input v-model="password" type="password" />

      <button type="submit">Logar!</button>
    </form>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup (props, context) {
    const { replace } = useRouter()

    const store = useStore()

    const fields = reactive({
      email: '',
      password: ''
    })

    const login = async () => {
      try {
        await store.dispatch('auth/login', fields)
        replace({ name: 'Home' })
      } catch {
        console.log('Deu erro')
      }
    }

    return {
      ...toRefs(fields),
      login
    }
  }
}
</script>
