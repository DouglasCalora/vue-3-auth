import GenericStore from '../helpers/genericStore'
const store = new GenericStore({
  paths: {
    success: {
      fetchList: 'data',
      fetchSingle: 'data'
    }
  }
})

export default store.createModule('post')
