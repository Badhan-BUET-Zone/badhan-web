type LogInterface = {
  // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}
interface LogStoreStateInterface {
  consoleLogs: LogInterface[]
}
const state: LogStoreStateInterface = {
  consoleLogs: []
}

const getters = {
  getConsoleLogs (state: LogStoreStateInterface) {
    return state.consoleLogs
  }
}
const mutations = {
  addConsoleLog (state: LogStoreStateInterface, consoleLog: LogInterface) {
    state.consoleLogs.unshift(consoleLog)
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
