import { handleGETPublicContacts, isGuestEnabled } from '@/api'
import ldb from '../localDatabase'
import {Commit} from "vuex";

export interface PublicContactInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}
interface PublicContactStoreStateInterface {
  publicContacts: PublicContactInterface[]
  publicContactsLoaderFlag: boolean
}

const state = {
  publicContacts: [],
  publicContactsLoaderFlag: false
}

const getters = {
  getPublicContacts (state: PublicContactStoreStateInterface) {
    return state.publicContacts
  },
  getPublicContactsLoaderFlag (state: PublicContactStoreStateInterface) {
    return state.publicContactsLoaderFlag
  }
}
const mutations = {
  setPublicContacts (state: PublicContactStoreStateInterface, payload: { publicContacts: PublicContactInterface[] }) {
    state.publicContacts = payload.publicContacts
  },
  publicContactsLoaderFlagOn (state: PublicContactStoreStateInterface) {
    state.publicContactsLoaderFlag = true
  },
  publicContactsLoaderFlagOff (state: PublicContactStoreStateInterface) {
    state.publicContactsLoaderFlag = false
  }
}
const actions = {
  async fetchPublicContacts ({ commit }: { commit: Commit}) {
    const cachedPublicContactResult = ldb.publicContacts.load()
    if (cachedPublicContactResult.status === 'OK') {
      commit('setPublicContacts', cachedPublicContactResult.data)
      return
    } else if (cachedPublicContactResult.status === 'ERROR') {
      commit('publicContactsLoaderFlagOn')
    } else if (cachedPublicContactResult.status === 'EXPIRED') {
      commit('setPublicContacts', cachedPublicContactResult.data)
    }
    const response = await handleGETPublicContacts()
    commit('publicContactsLoaderFlagOff')
    if (response.status !== 200) return
    commit('setPublicContacts', response.data)

    if (isGuestEnabled()) return
    ldb.publicContacts.save(response.data)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
