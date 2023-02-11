/* eslint-disable */ 
// @ts-nocheck
/* eslint-disable */
import {
  handleGETStatistics,
  handleDELETELogs,
  handleGETDonorDesignatedAll,
  handleGETCredits
} from '../api'

const state = {
  statistics: null,
  statisticsLoaderFlag: false,

  logs: [],
  logsLoaderFlag: false,

  logDeleteFlag: false,

  volunteers: [],
  volunteerLoaderFlag: false,

  credits: null,
  creditsLoaderFlag: false
}

const getters = {
  getStatistics: state => {
    return state.statistics
  },
  getStatisticsLoaderFlag: state => {
    return state.statisticsLoaderFlag
  },

  getLogs: state => {
    return state.logs
  },

  getLogsLoaderFlag: state => {
    return state.logsLoaderFlag
  },

  getLogDeleteFLag: state => {
    return state.logDeleteFlag
  },

  getVolunteers: state => {
    return state.volunteers
  },
  getVolunteerLoaderFlag: state => {
    return state.volunteerLoaderFlag
  },

  getCredits: state => {
    return state.credits
  },
  getCreditsLoaderFlag: state => {
    return state.creditsLoaderFlag
  }
}
const mutations = {
  setStatistics (state, payload) {
    state.statistics = payload
  },
  unsetStatistics (state) {
    state.statistics = null
  },
  setStatisticsLoaderFlag (state) {
    state.statisticsLoaderFlag = true
  },
  unsetStatisticsLoaderFlag (state) {
    state.statisticsLoaderFlag = false
  },

  setLogs (state, payload) {
    state.logs = payload
  },
  unsetLogs (state) {
    state.logs = []
  },
  setLogsLoaderFlag (state) {
    state.logsLoaderFlag = true
  },
  unsetLogsLoaderFlag (state) {
    state.logsLoaderFlag = false
  },
  setLogDeleteFlag (state) {
    state.logDeleteFlag = true
  },
  unsetLogDeleteFlag (state) {
    state.logDeleteFlag = false
  },

  setVolunteers (state, payload) {
    state.volunteers = payload
  },
  unsetVolunteers (state) {
    state.volunteers = []
  },
  setVolunteerLoaderFlag (state) {
    state.volunteerLoaderFlag = true
  },
  unsetVolunteerLoaderFlag (state) {
    state.volunteerLoaderFlag = false
  },

  setCredits (state, payload) {
    state.credits = payload
  },
  setCreditsLoader (state) {
    state.creditsLoaderFlag = true
  },
  unsetCreditsLoader (state) {
    state.creditsLoaderFlag = false
  }

}
const actions = {
  async fetchStatistics ({ commit, getters }) {
    commit('unsetStatistics')
    commit('setStatisticsLoaderFlag')
    const response = await handleGETStatistics()
    commit('unsetStatisticsLoaderFlag')
    if (response.status !== 200) return
    commit('setStatistics', response.data.statistics)
  },
  async removeAllLogs ({ commit, dispatch }) {
    commit('setLogDeleteFlag')
    await handleDELETELogs()
    commit('unsetLogDeleteFlag')
    commit('unsetLogs')
  },
  async fetchAllVolunteers ({ commit }) {
    commit('setVolunteerLoaderFlag')
    commit('unsetVolunteers')
    const response = await handleGETDonorDesignatedAll()
    commit('unsetVolunteerLoaderFlag')
    if (response.status !== 200) return
    commit('setVolunteers', response.data.data)
  },

  async fetchCredits ({ commit }) {
    commit('setCreditsLoader')
    const response = await handleGETCredits()
    commit('unsetCreditsLoader')
    if (response.status !== 200) return
    commit('setCredits', response.data)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true
}
