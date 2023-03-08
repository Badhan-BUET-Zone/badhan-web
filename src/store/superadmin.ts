import { handlePATCHAdmins } from '@/api'
import {Commit, Dispatch} from "vuex";

const state = {
  changeAdminLoaderFlag: false
}

interface HallAdminStoreStateInterface {
  changeAdminLoaderFlag: boolean
}

const getters = {
  getChangeAdminLoaderFlag: (state: HallAdminStoreStateInterface) => {
    return state.changeAdminLoaderFlag
  }
}
const mutations = {
  changeAdminLoaderFlagOn (state: HallAdminStoreStateInterface) {
    state.changeAdminLoaderFlag = true
  },
  changeAdminLoaderFlagOff (state: HallAdminStoreStateInterface) {
    state.changeAdminLoaderFlag = false
  },
}
const actions = {
  async changeHallAdmin ({ commit, dispatch } : {commit: Commit, dispatch: Dispatch}, payload: {donorId: string}) {
    commit('changeAdminLoaderFlagOn')
    const response = await handlePATCHAdmins(payload)
    commit('changeAdminLoaderFlagOff')
    if (response.status !== 200) return false
    dispatch('notification/notifySuccess', 'Successfully changed hall admin')
    return true
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
