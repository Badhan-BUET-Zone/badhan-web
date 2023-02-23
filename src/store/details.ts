import { handleGETDonors } from '@/api'
import {Commit} from "vuex";

interface ProfileInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}
interface DetailsStoreStateInterface {
  profile: null|ProfileInterface
  donorLoaderFlag: boolean
}

const state: DetailsStoreStateInterface = {
  // SEE DONOR DETAILS
  profile: null,
  donorLoaderFlag: true
}
const getters = {
  // SEE DETAILS
  getProfile: (state: DetailsStoreStateInterface) => {
    return state.profile
  },
  getDonorLoaderFlag: (state: DetailsStoreStateInterface) => {
    return state.donorLoaderFlag
  },
}
const mutations = {
  // SEE DETAILS
  setProfile (state: DetailsStoreStateInterface, payload: ProfileInterface) {
    state.profile = payload
  },
  donorLoaderFlagOn (state: DetailsStoreStateInterface) {
    state.donorLoaderFlag = true
  },
  donorLoaderFlagOff (state: DetailsStoreStateInterface) {
    state.donorLoaderFlag = false
  }

}
const actions = {
  async getDetails ({ commit }: {commit: Commit}, payload: {donorId: string}) {
    const params = {
      donorId: payload
    }
    commit('donorLoaderFlagOn')

    const response = await handleGETDonors(params)
    commit('donorLoaderFlagOff')

    if (response.status !== 200) return false

    commit('setProfile', response.data.donor)
    commit('callrecord/setCallRecords', response.data.donor.callRecords, { root: true })
    commit('donation/setDonationList', response.data.donor.donations.map((a:{date:number}) => a.date), { root: true })
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
