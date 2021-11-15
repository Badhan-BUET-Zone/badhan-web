import {
  enableGuestAPI,
  handleDELETESignOut,
  handleDELETESignOutAll,
  handleGETDonorsMe,
  handlePATCHRedirectedAuthentication,
  handlePOSTRedirection,
  handlePOSTSignIn,
  resetBaseURL
} from '../../api'

import ldb from '../../localDatabase'

const state = {
  token: null,
  signInLoaderFlag: false,
  error: '',

  redirectionRequestMade: false,
  isLoggedIn: false,
  isGuest: false,

  autoRedirectionPath: null
}

const getters = {

  getToken: state => {
    return state.token
  },
  getError: state => {
    return state.error
  },
  getSignInLoaderFlag: state => {
    return state.signInLoaderFlag
  },
  getIsLoggedIn: state => {
    return state.isLoggedIn
  },
  getIsGuest: state => {
    return state.isGuest
  },

  getAutoRedirectionPath: state => {
    return state.autoRedirectionPath
  }

}
const mutations = {
  setAutoRedirectionPath (state, path) {
    state.autoRedirectionPath = path
  },
  unsetAutoRedirectionPath (state) {
    state.autoRedirectionPath = null
  },

  loadTokenFromLocalStorage (state) {
    state.token = ldb.token.load()
  },

  saveTokenToLocalStorage (state) {
    ldb.token.save(state.token)
  },

  setToken (state, token) {
    state.token = token
  },

  removeToken (state) {
    state.token = null
    ldb.token.clear()
  },

  signInLoaderFlagOn (state) {
    state.signInLoaderFlag = true
  },

  signInLoaderFlagOff (state) {
    state.signInLoaderFlag = false
  },

  setSignInError (state, payload) {
    state.error = payload
  },
  clearSignInError (state) {
    state.error = ''
  },

  setLoginFlag (state) {
    state.isLoggedIn = true
  },
  unsetLoginFlag (state) {
    state.isLoggedIn = false
  }

}
const actions = {
  async logout ({ commit, dispatch }) {
    commit('setLoadingTrue')
    const data = await handleDELETESignOut()
    if (data) {
      dispatch('notification/notifySuccess', data.message)
    }
    commit('setLoadingFalse')
    commit('unsetLoginFlag')
    commit('removeToken')
    ldb.token.clear()
    ldb.reset()
    resetBaseURL()
  },
  async logoutAll ({ commit, dispatch }) {
    commit('setLoadingTrue')
    const data = await handleDELETESignOutAll()
    if (data) {
      dispatch('notification/notifySuccess', data.message)
    }

    commit('setLoadingFalse')
    commit('unsetLoginFlag')
    commit('removeToken')
    ldb.token.clear()
    ldb.reset()
    resetBaseURL()
  },
  async requestRedirectionToken ({ commit }) {
    commit('setLoadingTrue')
    const token = await handlePOSTRedirection()
    commit('setLoadingFalse')
    if (!token) return null
    return token
  },
  async redirectionLogin ({ getters, commit, dispatch }, payload) {
    ldb.reset()
    commit('signInLoaderFlagOn')
    const token = await handlePATCHRedirectedAuthentication({ token: payload })

    if (!token) {
      commit('signInLoaderFlagOff')
      return false
    }

    commit('setToken', token)
    const response = await handleGETDonorsMe()
    commit('signInLoaderFlagOff')

    if (response.status !== 200) return false

    const donor = response.data.donor
    commit('setMyProfile', donor)
    commit('setLoginFlag')
    commit('saveTokenToLocalStorage')
    return true
  },
  async autoLogin ({ getters, commit, dispatch }) {
    commit('loadTokenFromLocalStorage')
    if (getters.getToken === null) return true

    commit('signInLoaderFlagOn')
    const response = await handleGETDonorsMe()
    commit('signInLoaderFlagOff')

    if (!response) {
      return false
    }

    if (response.status !== 200) {
      if (response.status !== 401) return false
      commit('removeToken')
      ldb.token.clear()
      ldb.reset()
      return false
    }

    const donor = response.data.donor
    commit('setMyProfile', donor)
    commit('setLoginFlag')
    return true
  },
  async checkToken ({ getters, commit, dispatch }) {
    commit('signInLoaderFlagOn')
    const response = await handleGETDonorsMe()
    commit('signInLoaderFlagOff')

    if (response.status !== 200) {
      if (response.status !== 401) return false
      commit('removeToken')
      ldb.reset()
      return false
    }
    return response.data.donor
  },
  async guestLogin ({ dispatch }) {
    enableGuestAPI()
    await dispatch('login', { phone: '123465', password: 'oseihgfweoisng', rememberFlag: false })
  },

  async resetBaseURLOfAPI () {
    resetBaseURL()
  },

  async login ({ getters, commit, dispatch }, payload) {
    ldb.reset()
    commit('signInLoaderFlagOn')
    const sendData = {
      phone: parseInt('88' + payload.phone),
      password: payload.password
    }

    const data = await handlePOSTSignIn(sendData)

    if (!data) {
      commit('signInLoaderFlagOff')
      return false
    }
    commit('setToken', data.token)

    const response = await handleGETDonorsMe()
    commit('signInLoaderFlagOff')

    if (response.status !== 200) {
      return false
    }

    const donor = response.data.donor
    dispatch('notification/notifySuccess', data.message)
    commit('setMyProfile', donor)

    if (payload.rememberFlag) {
      commit('saveTokenToLocalStorage')
    } else {
      ldb.token.clear()
    }
    commit('setLoginFlag')
    return true
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
