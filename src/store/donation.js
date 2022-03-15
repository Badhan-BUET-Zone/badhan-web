import { handleDELETEDonations } from '../api'

const state = {
  lastDonation: 0,
  donationList: [],

  donationLoader: false,
  donationDeleteLoader: false,

  donationError: null,
  donationSuccess: null
}

const getters = {
  getLastDonation: state => {
    return state.lastDonation
  },
  getDonationList: state => {
    return state.donationList
  },
  getDonationLoader: state => {
    return state.donationLoader
  },
  getDonationDeleteLoader: state => {
    return state.donationDeleteLoader
  },
  getDonationError: state => {
    return state.donationError
  },
  getDonationSuccess: state => {
    return state.donationSuccess
  }
}
const mutations = {
  setLastDonation (state, payload) {
    state.lastDonation = payload
  },
  setDonationList (state, payload) {
    state.donationList = payload
  },
  clearDonationList (state) {
    state.donationList = []
  },
  donationLoaderOn (state) {
    state.donationLoader = true
  },
  donationLoaderOff (state) {
    state.donationLoader = false
  },
  donationDeleteLoaderOn (state) {
    state.donationDeleteLoader = true
  },
  donationDeleteLoaderOff (state) {
    state.donationDeleteLoader = false
  },
  setDonationError (state, payload) {
    state.donationError = payload
  },
  setDonationSuccess (state, payload) {
    state.donationSuccess = payload
  },
  clearDonationMessage (state) {
    state.donationError = null
    state.donationSuccess = null
  },
  addDonation (state, payload) {
    state.donationList.unshift(payload)
  }
}
const actions = {
  async deleteDonation ({ commit, getters, rootState, rootGetters, dispatch }, payload) {
    commit('donationDeleteLoaderOn')
    const dateToBeDeleted = payload.date
    const response = await handleDELETEDonations(payload)
    commit('donationDeleteLoaderOff')
    if (response.status !== 200) return
    const history = getters.getDonationList
    for (let i = 0; i < history.length; i++) {
      if (history[i] === dateToBeDeleted) {
        history.splice(i, 1)
        break
      }
    }
    let lastDonationNew = 0
    if (history.length !== 0) {
      lastDonationNew = history.reduce(function (a, b) {
        return Math.max(a, b)
      })
    }
    dispatch('notification/notifySuccess', 'Successfully deleted donation', { root: true })
    commit('setDonationList', history)
    return lastDonationNew
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
