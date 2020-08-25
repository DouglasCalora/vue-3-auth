<template>
  <div v-for="(user, index) in users" :key="index">{{ user.title }}</div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  setup () {
    const users = ref([])

    async function fetchUser () {
      try {
        const { data } = await axios.get('/user/watchedlist')
        users.value = data.data
      } catch {}
    }

    fetchUser()

    return {
      users
    }
  }
}
</script>
