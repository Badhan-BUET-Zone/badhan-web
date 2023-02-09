/* eslint-disable */ 
// @ts-nocheck
/* eslint-disable */
import { handlePATCHDonors } from '../api'

const state = {
  detailsLoaderFlag: false
}

const getters = {
  getDetailsLoaderFlag: state => {
    return state.detailsLoaderFlag
  }
}
const mutations = {
  detailsLoaderFlagOn (state) {
    state.detailsLoaderFlag = true
  },
  detailsLoaderFlagOff (state) {
    state.detailsLoaderFlag = false
  }
}
const actions = {
  async saveUserDetails ({ commit, getters, rootState, rootGetters, dispatch }, payload) {
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
