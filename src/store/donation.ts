import { handleDELETEDonations } from '@/api'
import {Commit, Dispatch } from "vuex";

interface DonationStoreStateInterface {
  lastDonation: number,
  donationList: number[],
  donationLoader: boolean,
  donationDeleteLoader: boolean
  donationError: string | null
  donationSuccess: string | null
}

const state: DonationStoreStateInterface = {
  lastDonation: 0,
  donationList: [],

  donationLoader: false,
  donationDeleteLoader: false,

  donationError: null,
  donationSuccess: null
}
export type Getters = {
  getDonationList: (state: DonationStoreStateInterface)=>number[]
}

const getters: Getters = {
  getDonationList: (state: DonationStoreStateInterface) => {
    return state.donationList
  },
}
const mutations = {
  setLastDonation (state: DonationStoreStateInterface, payload: number) {
    state.lastDonation = payload
  },
  setDonationList (state: DonationStoreStateInterface, payload: number[]) {
    state.donationList = payload
  },
  donationDeleteLoaderOn (state: DonationStoreStateInterface) {
    state.donationDeleteLoader = true
  },
  donationDeleteLoaderOff (state: DonationStoreStateInterface) {
    state.donationDeleteLoader = false
  },
  addDonation (state: DonationStoreStateInterface, payload: number) {
    state.donationList.unshift(payload)
  }
}
const actions = {
  async deleteDonation ({ commit, state, dispatch }: {commit: Commit, state: DonationStoreStateInterface, dispatch: Dispatch}, payload: {date: number}) {
    commit('donationDeleteLoaderOn')
    const dateToBeDeleted = payload.date
    const response = await handleDELETEDonations(payload)
    commit('donationDeleteLoaderOff')
    if (response.status !== 200) return
    const history = state.donationList
    for (let i = 0; i < history.length; i++) {
      if (history[i] === dateToBeDeleted) {
        history.splice(i, 1)
        break
      }
    }
    let lastDonationNew = 0
    if (history.length !== 0) {
      lastDonationNew = history.reduce(function (a: number, b: number) {
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
