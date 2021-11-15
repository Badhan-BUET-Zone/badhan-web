const state = {
  notificationFlag: false,
  notification: null,
  notificationColor: 'success'
}

const getters = {
  getNotification (state) {
    return state.notification
  },
  getNotificationFlag (state) {
    return state.notificationFlag
  },
  getNotificationColor (state) {
    return state.notificationColor
  }
}
const mutations = {
  setNotification (state, payload) {
    state.notification = payload
  },
  setNotificationFlag (state, payload) {
    state.notificationFlag = payload
  },
  setNotifiationColor (state, payload) {
    state.notificationColor = payload
  },
  dismissNotification (state) {
    setTimeout(() => {
      state.notificationFlag = false
    }, 3000)
  },
  clearNotification (state) {
    state.notificationFlag = false
  }
}
const actions = {
  notifySuccess ({ commit, getters, rootState, rootGetters }, payload) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'success')
    commit('dismissNotification')
  },
  notifyInfo ({ commit, getters }, payload) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'primary')
    commit('dismissNotification')
  },
  notifyError ({ commit, getters, rootState, rootGetters }, payload) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'error')
  },
  setNotificationFlag ({ commit, getters, rootState, rootGetters }, payload) {
    commit('setNotificationFlag', payload)
  },
  clearNotification ({ commit }) {
    commit('clearNotification')
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
