import { myConsole } from '@/mixins/myConsole'
interface ConfirmationStoreStateInterface {
  confirmationFlag: boolean
  confirmationMessage: null | string
  confirmationAction: ()=>void
}
const state: ConfirmationStoreStateInterface = {
  confirmationFlag: false,
  confirmationMessage: null,
  confirmationAction: () => {
    myConsole.log('No confirmation action set in confirmation box')
  }
}

const getters = {
  getConfirmationMessage (state: ConfirmationStoreStateInterface) {
    return state.confirmationMessage
  },
  getConfirmationAction (state: ConfirmationStoreStateInterface) {
    return state.confirmationAction
  },
  getConfirmationFlag (state: ConfirmationStoreStateInterface) {
    return state.confirmationFlag
  }
}
const mutations = {
  setConfirmationMessage (state: ConfirmationStoreStateInterface, payload: {confirmationMessage: string, confirmationAction: ()=>void}) {
    state.confirmationMessage = payload.confirmationMessage
    state.confirmationAction = payload.confirmationAction
    state.confirmationFlag = true
  },
  resetConfirmationBox (state: ConfirmationStoreStateInterface) {
    state.confirmationAction = () => {
      myConsole.log('No confirmation action set in confirmation box')
    }
    state.confirmationFlag = false
  },
  setConfirmationFlag (state: ConfirmationStoreStateInterface, payload: boolean) {
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
