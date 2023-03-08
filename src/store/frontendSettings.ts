import { handleGETFrontendSettings } from '@/api'
import ldb from '../localDatabase'
import {Commit} from "vuex";

export interface FrontendSettingsStoreStateInterface {
  settings: {
    version: string
  }
}

const state: FrontendSettingsStoreStateInterface = {
  settings: {
    version: '4.5.1'
  }
}
const getters = {
  getSettings (state: FrontendSettingsStoreStateInterface) {
    return state.settings
  }
}
const mutations = {
  setSettings (state: FrontendSettingsStoreStateInterface, settings: {version: string}) {
    state.settings = settings
    ldb.frontendSettings.save(settings)
  }
}
const actions = {
  async fetchSettings ({ commit }: {commit: Commit}) {
    const response = await handleGETFrontendSettings()
    if (response.status !== 200) return
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
