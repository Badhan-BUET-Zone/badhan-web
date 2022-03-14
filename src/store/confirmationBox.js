import { myConsole } from '../mixins/myConsole'
const state = {
  confirmationFlag: false,
  confirmationMessage: null,
  confirmationAction: () => {
    myConsole.log('No confirmation action set in confirmation box')
  }
}

const getters = {
  getConfirmationMessage (state) {
    return state.confirmationMessage
  },
  getConfirmationAction (state) {
    return state.confirmationAction
  },
  getConfirmationFlag (state) {
    return state.confirmationFlag
  }
}
const mutations = {
  setConfirmationMessage (state, payload) {
    state.confirmationMessage = payload.confirmationMessage
    state.confirmationAction = payload.confirmationAction
    state.confirmationFlag = true
  },
  resetConfirmationBox (state) {
    state.confirmationAction = () => {
      myConsole.log('No confirmation action set in confirmation box')
    }
    state.confirmationFlag = false
  },
  setConfirmationFlag (state, payload) {
    state.confirmationFlag = payload
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
