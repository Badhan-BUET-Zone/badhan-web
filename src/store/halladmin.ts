import {handlePOSTDonors, handlePOSTDonations, POSTDonorsPayloadInterface} from '@/api'
import {Commit, Dispatch} from "vuex";

interface HallAdminStoreStateInterface {
  newDonorLoader: boolean
}

const state = {
  newDonorLoader: false
}

const getters = {
  getNewDonorLoader: (state: HallAdminStoreStateInterface) => {
    return state.newDonorLoader
  }
}
const mutations = {
  newDonorLoaderOn (state: HallAdminStoreStateInterface) {
    state.newDonorLoader = true
  },
  newDonorLoaderOff (state: HallAdminStoreStateInterface) {
    state.newDonorLoader = false
  }
}

const actions = {
  async saveDonor ({ commit, dispatch }: {commit: Commit, dispatch: Dispatch}, payload: POSTDonorsPayloadInterface) {
    commit('newDonorLoaderOn')
    const response = await handlePOSTDonors(payload)
    if (response.status !== 201) {
      commit('newDonorLoaderOff')
      return response
    }
    if (payload.lastDonation !== 0) {
      const donationData = {
        donorId: response.data.newDonor._id,
        date: payload.lastDonation
      }
      await handlePOSTDonations(donationData)
    }
    commit('newDonorLoaderOff')
    dispatch('notification/notifySuccess', 'Donor added successfully', { root: true })
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
