<template>
  {{ list }} {{ errors }}
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex'

export default {
  mounted () {
    console.log(useStore())
    this.fetchList({
      params: { category: 'tec' },
      successPath: 'data'
    })
  },

  computed: {
    ...mapGetters('post', ['list', 'errors'])
  },

  methods: {
    ...mapActions('post', ['fetchList'])
  }
}
</script>
