import { handleGETAdmins, handlePATCHAdmins } from '../api'

const state = {
  hallAdmins: null,
  hallAdminsLoaderFlag: false,
  changeAdminLoaderFlag: false
}

const getters = {
  getHallAdmins: state => {
    return state.hallAdmins
  },
  getHallAdminsLoaderFlag: state => {
    return state.hallAdminsLoaderFlag
  },
  getChangeAdminLoaderFlag: state => {
    return state.changeAdminLoaderFlag
  }
}
const mutations = {
  setHallAdmins (state, payload) {
    state.hallAdmins = payload
  },
  hallAdminsLoaderFlagOn (state) {
    state.hallAdminsLoaderFlag = true
  },
  hallAdminsLoaderFlagOff (state) {
    state.hallAdminsLoaderFlag = false
  },

  changeAdminLoaderFlagOn (state) {
    state.changeAdminLoaderFlag = true
  },
  changeAdminLoaderFlagOff (state) {
    state.changeAdminLoaderFlag = false
  },
  clearHallAdmins (state) {
    state.hallAdmins = null
  }

}
const actions = {
  async fetchHallAdmins ({ commit }) {
    commit('hallAdminsLoaderFlagOn')
    const response = await handleGETAdmins()
    commit('hallAdminsLoaderFlagOff')
    if (response.status !== 200) return
    commit('setHallAdmins', response.data.admins)
  },

  async changeHallAdmin ({ commit, getters, dispatch }, payload) {
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
