interface MessageBoxStoreStateInterface {
  messageFlag: boolean
  message: null | string
}
const state: MessageBoxStoreStateInterface = {
  messageFlag: false,
  message: null
}

const getters = {
  getMessage (state: MessageBoxStoreStateInterface) {
    return state.message
  },
  getNotificationFlag (state: MessageBoxStoreStateInterface) {
    return state.messageFlag
  }
}
const mutations = {
  setMessage (state: MessageBoxStoreStateInterface, payload: string) {
    state.message = payload
    state.messageFlag = true
  },
  setMessageFlag (state: MessageBoxStoreStateInterface, payload: boolean) {
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
