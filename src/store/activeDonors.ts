import { handleGETActiveDonors } from '@/api'
import {Commit} from "vuex";

interface ActiveDonorInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}

interface ActiveDonorStoreStateInterface {
  activeDonors: ActiveDonorInterface[]
}


interface ActiveDonorPayloadInterface {
  name: string,
  bloodGroup: number,
  batch: string,
  hall: number,
  isAvailable: boolean,
  isNotAvailable: boolean,
  address: string,
  availableToAll: boolean,
  markedByMe: boolean,
  availableToAllOrHall: false
}

const state: ActiveDonorStoreStateInterface = {
  activeDonors: []
}

const getters = {
  getActiveDonors (state: ActiveDonorStoreStateInterface) {
    return state.activeDonors
  }
}
const mutations = {
  setActiveDonors (state: ActiveDonorStoreStateInterface, payload: ActiveDonorInterface[]) {
    state.activeDonors = payload
  }
}
const actions = {
  async fetchActiveDonors ({ commit }: {commit: Commit}, payload: ActiveDonorPayloadInterface) {
    const activeDonorsResult = await handleGETActiveDonors(payload)
    if (activeDonorsResult.status !== 200) return
    commit('setActiveDonors', activeDonorsResult.data.activeDonors)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
