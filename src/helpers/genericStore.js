import axios from 'axios'
import { get, isEmpty } from 'lodash'

export default class {
  /**
   * In the constructor you can pass the global congit of GenericStore
   *
   * @param {object} globalCongif
   *
   * @example
   * const store = new GenercStore({
   *  api: axios, // you have to pass the instance of axios!
  *   identifier: 'uuid' // you can passa the name of key for identifer, example: id, uuid... etc, if you don't pass any the default value is "id"
   *  paths: { // this object is for configure the path of response to object you need!
   *    success: {
   *      default: 'response.data', // it will handle all the paths of success and 'response.data' it's already the default value you don't need to pass
   *      fetchList: 'response.data.list', // it will handle the path of list success
   *      fetchSingle: 'response.data.single', // it will handle the path of single success
   *      update: 'response.data.update', // it will handle the path of update success
   *      create: 'response.data.create', // it will handle the path of update success
   *    },
   *    error: {
   *      default: 'response.error.data', // it will handle all the paths of success and 'response.data' it's already the default value you don't need to pass
   *      fetchList: 'response.error.data.list', // it will handle the path of list success
   *      fetchSingle: 'response.error.data.single', // it will handle the path of single success
   *      update: 'response.error.data.update', // it will handle the path of update success
   *      create: 'response.error.data.create', // it will handle the path of update success
   *      delete: 'response.error.data.create', // it will handle the path of update success
   *    }
   *  }
   * })
   */
  constructor (globalCongif = {}) {
    const {
      api,
      paths = {},
      identifier
    } = globalCongif

    // if (!api) {
    //   throw new Error('Plese provide an instance of axios')
    // }

    this.api = api
    this.paths = { success: {}, error: {}, ...paths }
    this.identifier = identifier

    console.log('constructor -> this.paths', this.paths)
  }

  /**
   * Function that handle path to object using the method "get" from lodash
   *
   * @param {object} result result of API success
   * @param {object} paths path to result
   * @param {boolean} [isError] isError result of catch
   * @return {[]|object|string|number} return the value of API
   *
   * @example
   * handlePath(apiResponse, {
   *  model: 'list'
   * }, true)
   */
  handlePath (result, paths, isError) {
    const { path, model } = paths
    const pathModel = isError ? 'error' : 'success'

    if (!path && !this.paths[pathModel][model] && !this.paths[pathModel].default) {
      return isError ? result.response.data : result.data
    }

    return get(result, path || this.paths[pathModel][model] || this.paths[pathModel].default)
  }

  createModule (entity, config = {}) {
    const self = this
    const identifier = config.identifier || this.identifier || 'id'

    return {
      namespaced: config.namespaced || true,

      state: {
        list: [],
        single: {},
        errors: {
          fetchList: null,
          fetchSingle: null,
          update: null,
          create: null,
          delete: null
        }
      },

      getters: {
        list: ({ list }) => list,

        singleById: ({ list }) => id => list.find(item => item[identifier] === id) || {},

        single: ({ single }) => single,

        errors: ({ errors }) => errors
      },

      mutations: {
        setList (state, list) {
          state.list = list
        },

        setSingle (state, { payload, id, singleState }) {
          if (singleState) {
            state.single = payload
            return
          }

          const index = state.list.findIndex(item => item[identifier] === id)

          ~index ? state.list.splice(index, 1, payload) : state.list.push(payload)
        },

        updateList (state, { payload, id }) {
          const index = state.list.findIndex(item => item[identifier] === id)

          if (~index) {
            return state.list.splice(index, 1, payload)
          }

          if (state.single[identifier] === id) {
            state.single = payload
            return
          }

          state.errors.update = true
        },

        setToList (state, payload) {
          state.list.push(payload)
        },

        deleteState (state, id) {
          const index = state.list.findIndex(item => item[identifier] === id)

          if (~index) {
            state.list.splice(index, 1)
          }

          if (state.single[identifier] === id) {
            state.single = {}
          }
        },

        setErrors (state, { model, error, clear }) {
          error = isEmpty(error) ? true : error
          state.errors[model] = clear ? null : error
        }
      },

      actions: {
        /**
         * function that fetch the methods "get" and returns a list (array),
         * and populate the state "list"
         *
         * @param {object} commit call the mutation setList and setErrors
         * @param {object} configs get all configs
         * @return {Promise} return the promise of API (can be success or error)
         *
         * @example
         * fetchList({
         *  params: { search: 'title', offset: 12 },
         *  url: '/users/list',
         *  errorPath: 'data.results',
         *  listPath: 'data.results.'
         * }).then(response => console.log('Hi it worked! :)', response)).catch(error => {
         *  console.log('Sorry it does not worked :(', error)
         * })
         */
        fetchList ({ commit }, { params, url, successPath, errorPath } = {}) {
          const model = 'fetchList'

          url = url || config.fetchListURL || `/${entity}`

          return axios.get(url, { params }).then(response => {
            commit('setErrors', { model, clear: true })

            return commit('setList', self.handlePath(response, { path: successPath, model })) && response
          }).catch(error => {
            return Promise.reject(error) && commit('setErrors', {
              model,
              error: self.handlePath(error, { path: errorPath, model }, true)
            })
          })
        },

        /**
         * funtion the fetch method "get" with id (or without) and returns an object
         * and populate the state "single"
         *
         * @param {object} commit call the mutation setSingle and setErrors
         * @param {object} configs get all configs
         * @return {Promise} return the promise of API (can be success or error)
         *
         * @example
         * fetchSingle({
         *  params: { search: 'name' },
         *  url: 'user/list',
         *  errorPath: 'data.results',
         *  path: 'data.results.'
         * }).then(response => console.log('Hi it worked! :)', response)).catch(error => {
         *  console.log('Sorry it does not worked :(', error)
         * })
         */
        fetchSingle ({ commit }, { params, url, id, errorPath, successPath, singleState } = {}) {
          const model = 'fetchSingle'

          url = url || config.fetchSingleURL || id ? `/${entity}/${id}` : `/${entity}`

          return axios.get(url, params).then(response => {
            commit('setErrors', { model, clear: true })

            return commit('setSingle', {
              id,
              singleState,
              payload: self.handlePath(response, { path: successPath, model })
            }) && response
          }).catch(error => {
            return Promise.reject(error) && commit('setErrors', {
              model,
              error: self.handlePath(error, { path: errorPath, model }, true)
            })
          })
        },

        update ({ commit }, { payload, url, id, errorPath, successPath } = {}) {
          const model = 'update'

          url = url || config.updateURL || id ? `/${entity}/id` : `/${entity}`

          return axios.put(url, payload).then(response => {
            commit('setErrors', { model, clear: true })

            return commit('updateList', {
              id: id || payload[identifier],
              payload: self.handlePath(response, { path: successPath, model })
            })
          }).catch(error => {
            return Promise.reject(error) && commit('setErrors', {
              model,
              error: self.handlePath(error, { path: errorPath, model }, true)
            })
          })
        },

        create ({ commit }, { payload, url, successPath, errorPath } = {}) {
          const model = 'create'

          url = url || config.createURL || `/${entity}`

          return axios.post(url, payload).then(response => {
            commit('setErrors', { model, clear: true })

            return commit('setToList', self.handlePath(response, { path: successPath, model }))
          }).catch(error => {
            return Promise.reject(error) && commit('setErrors', {
              model,
              error: self.handlePath(error, { path: errorPath, model }, true)
            })
          })
        },

        delete ({ commit }, { url, id, params, errorPath } = {}) {
          const model = 'delete'

          url = url || config.deleteURL || `/${entity}/${id}`

          return axios.delete(url, params).then(response => {
            commit('setErrors', { model, clear: true })

            return commit('deleteState', id) && response
          }).catch(error => {
            return Promise.reject(error) && commit('setErrors', {
              model,
              error: self.handlePath(error, { path: errorPath, model }, true)
            })
          })
        }
      }
    }
  }
}
