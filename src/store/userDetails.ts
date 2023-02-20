import { handlePATCHDonors } from '@/api'
import {Commit, Dispatch} from 'vuex'

const state = {
  detailsLoaderFlag: false
}

const getters = {
  getDetailsLoaderFlag: (state:{detailsLoaderFlag: boolean}) => {
    return state.detailsLoaderFlag
  }
}
const mutations = {
  detailsLoaderFlagOn (state:{detailsLoaderFlag: boolean}) {
    state.detailsLoaderFlag = true
  },
  detailsLoaderFlagOff (state:{detailsLoaderFlag: boolean}) {
    state.detailsLoaderFlag = false
  }
}
const actions = {
  async saveUserDetails ({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }, payload: {newPhone: string}) {
    commit('detailsLoaderFlagOn')
    const response = await handlePATCHDonors(payload)
    commit('detailsLoaderFlagOff')
    if (response.status !== 200) return
    dispatch('notification/notifySuccess', 'Saved details successfully', { root: true })
    commit('setPhone', parseInt(payload.newPhone), { root: true })
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
