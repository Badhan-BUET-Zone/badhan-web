import { handleGETDonors } from '../../api'

const state = {
  // SEE DONOR DETAILS
  profile: null,
  donorLoaderFlag: true
}
const getters = {
  // SEE DETAILS
  getProfile: state => {
    return state.profile
  },
  getDonorLoaderFlag: state => {
    return state.donorLoaderFlag
  },
  getDonorDetailsError: state => {
    return state.donorDetailsError
  }
}
const mutations = {
  // SEE DETAILS
  setProfile (state, payload) {
    state.profile = payload
  },
  donorLoaderFlagOn (state) {
    state.donorLoaderFlag = true
  },
  donorLoaderFlagOff (state) {
    state.donorLoaderFlag = false
  }

}
const actions = {
  async getDetails ({ commit, getters, rootState, rootGetters, dispatch }, payload) {
    const params = {
      donorId: payload
    }
    commit('donorLoaderFlagOn')

    const response = await handleGETDonors(params)
    commit('donorLoaderFlagOff')

    if (response.status !== 200) return false

    commit('setProfile', response.data.donor)
    commit('callrecord/setCallRecords', response.data.donor.callRecords, { root: true })
    commit('donation/setDonationList', response.data.donor.donations.map(a => a.date), { root: true })
    return true
  }
}
export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
