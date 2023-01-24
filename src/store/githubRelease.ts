// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
import { handleGETAppVersions } from '../api'

const state = {
  githubVersion: null,
  githubLink: null,
  githubReleaseLoader: false
}

const getters = {
  getGithubVersion: state => {
    return state.githubVersion
  },
  getGithubLink: state => {
    return state.githubLink
  },
  getGithubReleaseLoader: state => {
    return state.githubReleaseLoader
  }
}
const mutations = {
  setGithubVersion (state, payload) {
    state.githubVersion = payload
  },
  setGithubLink (state, payload) {
    state.githubLink = payload
  },
  githubReleaseLoaderOn (state) {
    state.githubReleaseLoader = true
  },
  githubReleaseLoaderOff (state) {
    state.githubReleaseLoader = false
  }
}
const actions = {
  async fetchGithubRelease ({ commit, getters, rootState, rootGetters, dispatch }) {
    commit('githubReleaseLoaderOn')
    const appVersionResponse = await handleGETAppVersions()
    commit('githubReleaseLoaderOff')
    if (appVersionResponse.status !== 200) return
    commit('setGithubVersion', appVersionResponse.data.githubReleaseVersion)
    commit('setGithubLink', appVersionResponse.data.githubReleaseDownloadURL)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
