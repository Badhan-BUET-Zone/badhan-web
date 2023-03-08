import {Commit} from "vuex";

interface NotificationStateInterface {
  notificationFlag: boolean
  notification: string | null
  notificationColor: string
}

const state: NotificationStateInterface = {
  notificationFlag: false,
  notification: null,
  notificationColor: 'success'
}

const getters = {
  getNotification (state: NotificationStateInterface) {
    return state.notification
  },
  getNotificationFlag (state: NotificationStateInterface) {
    return state.notificationFlag
  },
  getNotificationColor (state: NotificationStateInterface) {
    return state.notificationColor
  }
}
const mutations = {
  setNotification (state: NotificationStateInterface, payload: string) {
    state.notification = payload
  },
  setNotificationFlag (state: NotificationStateInterface, payload: boolean) {
    state.notificationFlag = payload
  },
  setNotifiationColor (state: NotificationStateInterface, payload: string) {
    state.notificationColor = payload
  },
  dismissNotification (state: NotificationStateInterface) {
    setTimeout(() => {
      state.notificationFlag = false
    }, 3000)
  },
  clearNotification (state: NotificationStateInterface) {
    state.notificationFlag = false
  }
}
const actions = {
  notifySuccess ({ commit }: { commit: Commit}, payload: string) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'success')
    commit('dismissNotification')
  },
  notifyInfo ({ commit }: { commit: Commit}, payload: string) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'primary')
    commit('dismissNotification')
  },
  notifyError ({ commit }: { commit: Commit}, payload: string) {
    commit('setNotificationFlag', true)
    commit('setNotification', payload)
    commit('setNotifiationColor', 'error')
  },
  setNotificationFlag ({ commit }: {commit: Commit}, payload: boolean) {
    commit('setNotificationFlag', payload)
  },
  clearNotification ({ commit }: {commit: Commit}) {
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
