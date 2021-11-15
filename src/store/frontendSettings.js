import { handleGETFrontendSettings } from '../api'
import ldb from '../localDatabase'
const state = {
  settings: {
    version: '4.5.1',
    backendBaseURL: process.env.VUE_APP_BADHAN_API_BASE_URL,
    backendTestBaseURL: process.env.VUE_APP_BADHAN_API_BASE_URL,
    defaultExists: true
  }
}

const getters = {
  getSettings (state) {
    if (state.settings.defaultExists) {
      const cachedSettings = ldb.frontendSettings.load()
      if (cachedSettings.status !== 'ERROR') {
        state.settings = cachedSettings.data
      }
    }
    return state.settings
  }
}
const mutations = {
  setSettings (state, settings) {
    state.settings = settings
    ldb.frontendSettings.save(settings)
  }
}
const actions = {
  async fetchSettings ({ commit, dispatch, getters }) {
    const response = await handleGETFrontendSettings()
    if (response.status !== 200) return
    console.log(response.data)
    commit('setSettings', response.data)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
