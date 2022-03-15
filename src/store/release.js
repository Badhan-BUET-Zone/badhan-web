import { handleGETAppVersion } from '../api'

const state = {
  appDetailsLoader: false,
  appVersion: null
}

const getters = {
  getAppDetailsLoader (state) {
    return state.appDetailsLoader
  },
  getAppVersion (state) {
    return state.appVersion
  }

}
const mutations = {
  setAppDetailsLoader (state) {
    state.appDetailsLoader = true
  },
  unsetAppDetailsLoader (state) {
    state.appDetailsLoader = false
  },
  setAppVersion (state, payload) {
    state.appVersion = payload
  }
}
const actions = {
  async fetchtAppDetails ({ commit, getters, rootState, rootGetters, dispatch }) {
    commit('setAppDetailsLoader')
    const response = await handleGETAppVersion()
    commit('unsetAppDetailsLoader')
    if (response.status === 200) {
      commit('setAppVersion', response.data.version)
    }
    return response
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
