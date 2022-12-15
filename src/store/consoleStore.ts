// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const state = {
  consoleLogs: []
}

const getters = {
  getConsoleLogs (state) {
    return state.consoleLogs
  }
}
const mutations = {
  addConsoleLog (state, consoleLog) {
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
