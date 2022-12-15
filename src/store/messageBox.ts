// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const state = {
  messageFlag: false,
  message: null
}

const getters = {
  getMessage (state) {
    return state.message
  },
  getNotificationFlag (state) {
    return state.messageFlag
  }
}
const mutations = {
  setMessage (state, payload) {
    state.message = payload
    state.messageFlag = true
  },
  setMessageFlag (state, payload) {
    state.messageFlag = payload
  }
}
const actions = {

}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
