import {
  handleGETStatistics,
  handleDELETELogs,
  handleGETDonorDesignatedAll,
  handleGETCredits
} from '@/api'

import {Commit} from 'vuex'

interface LogInterface {
  _id: string
}

interface StatisticsInterface {
  donorCount: number
  donationCount: number
  volunteerCount: number
}

interface VolunteerInterface {
  _id: string
}

interface CreditInterface {
  _id: string
}

interface StatisticsStoreInterface {
  statistics: StatisticsInterface | null
  statisticsLoaderFlag: boolean

  logs: LogInterface[]
  logsLoaderFlag: boolean
  logDeleteFlag: boolean
  volunteers: VolunteerInterface[]
  volunteerLoaderFlag: boolean
  credits: CreditInterface
  creditsLoaderFlag: boolean
}

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
  getStatistics: (state: StatisticsStoreInterface) => {
    return state.statistics
  },
  getStatisticsLoaderFlag: (state: StatisticsStoreInterface) => {
    return state.statisticsLoaderFlag
  },

  getLogs: (state: StatisticsStoreInterface) => {
    return state.logs
  },

  getLogsLoaderFlag: (state: StatisticsStoreInterface) => {
    return state.logsLoaderFlag
  },

  getLogDeleteFLag: (state: StatisticsStoreInterface) => {
    return state.logDeleteFlag
  },

  getVolunteers: (state: StatisticsStoreInterface) => {
    return state.volunteers
  },
  getVolunteerLoaderFlag: (state: StatisticsStoreInterface) => {
    return state.volunteerLoaderFlag
  },

  getCredits: (state: StatisticsStoreInterface) => {
    return state.credits
  },
  getCreditsLoaderFlag: (state: StatisticsStoreInterface) => {
    return state.creditsLoaderFlag
  }
}
const mutations = {
  setStatistics (state: StatisticsStoreInterface, payload: StatisticsInterface) {
    state.statistics = payload
  },
  unsetStatistics (state: StatisticsStoreInterface) {
    state.statistics = null
  },
  setStatisticsLoaderFlag (state: StatisticsStoreInterface) {
    state.statisticsLoaderFlag = true
  },
  unsetStatisticsLoaderFlag (state: StatisticsStoreInterface) {
    state.statisticsLoaderFlag = false
  },
  unsetLogs (state: StatisticsStoreInterface) {
    state.logs = []
  },
  setLogDeleteFlag (state: StatisticsStoreInterface) {
    state.logDeleteFlag = true
  },
  unsetLogDeleteFlag (state: StatisticsStoreInterface) {
    state.logDeleteFlag = false
  },

  setVolunteers (state: StatisticsStoreInterface, payload: VolunteerInterface[]) {
    state.volunteers = payload
  },
  unsetVolunteers (state: StatisticsStoreInterface) {
    state.volunteers = []
  },
  setVolunteerLoaderFlag (state: StatisticsStoreInterface) {
    state.volunteerLoaderFlag = true
  },
  unsetVolunteerLoaderFlag (state: StatisticsStoreInterface) {
    state.volunteerLoaderFlag = false
  },

  setCredits (state: StatisticsStoreInterface, payload: CreditInterface) {
    state.credits = payload
  },
  setCreditsLoader (state: StatisticsStoreInterface) {
    state.creditsLoaderFlag = true
  },
  unsetCreditsLoader (state: StatisticsStoreInterface) {
    state.creditsLoaderFlag = false
  }

}
const actions = {
  async fetchStatistics ({ commit } : { commit: Commit}) {
    commit('unsetStatistics')
    commit('setStatisticsLoaderFlag')
    const response = await handleGETStatistics()
    commit('unsetStatisticsLoaderFlag')
    if (response.status !== 200) return
    commit('setStatistics', response.data.statistics)
  },
  async removeAllLogs ({ commit }: {commit: Commit}) {
    commit('setLogDeleteFlag')
    await handleDELETELogs()
    commit('unsetLogDeleteFlag')
    commit('unsetLogs')
  },
  async fetchAllVolunteers ({ commit }: {commit: Commit}) {
    commit('setVolunteerLoaderFlag')
    commit('unsetVolunteers')
    const response = await handleGETDonorDesignatedAll()
    commit('unsetVolunteerLoaderFlag')
    if (response.status !== 200) return
    commit('setVolunteers', response.data.data)
  },

  async fetchCredits ({ commit }: {commit: Commit}) {
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
