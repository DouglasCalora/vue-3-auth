<template>
  <h1>
    Você foi deslogado com sucesso!
  </h1>

  <button @click="goToLogin">Clique aqui para Logar</button>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  setup () {
    const { replace } = useRouter()

    function goToLogin () {
      return replace({ name: 'Login' })
    }

    return {
      goToLogin
    }
  }
}
</script>
