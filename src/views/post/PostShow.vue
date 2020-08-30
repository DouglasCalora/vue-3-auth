<template>
  {{ post }} {{ errors }}
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex'

export default {
  mounted () {
    console.log(useStore())
    this.fetchSingle({
      id: '1', successPath: 'data'
    })
  },

  computed: {
    ...mapGetters('post', ['singleById', 'errors']),

    post () {
      return this.singleById(1)
    }
  },

  methods: {
    ...mapActions('post', ['fetchSingle'])
  }
}
</script>
