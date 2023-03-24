import { handlePOSTDonations } from '@/api'
import {Commit, Dispatch} from "vuex";

interface DonateStoreStateInterface {
  donationLoaderFlag: boolean
}

const state:DonateStoreStateInterface = {
  donationLoaderFlag: false
}

const getters = {
  getDonationLoaderFlag: (state: DonateStoreStateInterface) => {
    return state.donationLoaderFlag
  }
}
const mutations = {
  donationLoaderFlagOn (state: DonateStoreStateInterface) {
    state.donationLoaderFlag = true
  },
  donationLoaderFlagOff (state: DonateStoreStateInterface) {
    state.donationLoaderFlag = false
  }
}
const actions = {
  async donate ({ commit, dispatch }: {commit: Commit, dispatch: Dispatch}, payload:{donorId: string, newDonationDate: number}) {
    const sendData = {
      donorId: payload.donorId,
      date: new Date(payload.newDonationDate).getTime()
    }
    commit('donationLoaderFlagOn')
    const response = await handlePOSTDonations(sendData)
    commit('donationLoaderFlagOff')
    if (response.status !== 201) return null
    dispatch('notification/notifySuccess', response.data.message, { root: true })
    return response.data.newDonation
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
