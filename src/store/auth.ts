import {
  enableGuestAPI,
  handleDELETESignOut,
  handleDELETESignOutAll,
  handleGETDonorsMe,
  handlePATCHRedirectedAuthentication,
  handlePOSTRedirection,
  handlePOSTSignIn,
  resetBaseURL
} from '@/api'

import ldb from '../localDatabase'
import {Commit, Dispatch} from "vuex";

interface AuthStoreStateInterface {
  token: null | string
  signInLoaderFlag: boolean
  error: string
  redirectionRequestMade: boolean
  isLoggedIn: boolean
  isGuest: boolean
  autoRedirectionPath: string | null
}

const state: AuthStoreStateInterface = {
  token: null,
  signInLoaderFlag: false,
  error: '',

  redirectionRequestMade: false,
  isLoggedIn: false,
  isGuest: false,

  autoRedirectionPath: null
}

const getters = {
  getToken: (state: AuthStoreStateInterface) => {
    return state.token
  },
  getSignInLoaderFlag: (state: AuthStoreStateInterface) => {
    return state.signInLoaderFlag
  },
  getIsLoggedIn: (state: AuthStoreStateInterface) => {
    return state.isLoggedIn
  },
  getAutoRedirectionPath: (state: AuthStoreStateInterface) => {
    return state.autoRedirectionPath
  }

}
const mutations = {
  setAutoRedirectionPath (state: AuthStoreStateInterface, path: string) {
    state.autoRedirectionPath = path
  },
  unsetAutoRedirectionPath (state: AuthStoreStateInterface) {
    state.autoRedirectionPath = null
  },

  loadTokenFromLocalStorage (state: AuthStoreStateInterface) {
    state.token = ldb.token.load()
  },

  saveTokenToLocalStorage (state: AuthStoreStateInterface) {
    ldb.token.save(state.token)
  },

  setToken (state: AuthStoreStateInterface, token: string) {
    state.token = token
  },

  removeToken (state: AuthStoreStateInterface) {
    state.token = null
    ldb.token.clear()
  },

  signInLoaderFlagOn (state: AuthStoreStateInterface) {
    state.signInLoaderFlag = true
  },

  signInLoaderFlagOff (state: AuthStoreStateInterface) {
    state.signInLoaderFlag = false
  },
  clearSignInError (state: AuthStoreStateInterface) {
    state.error = ''
  },

  setLoginFlag (state: AuthStoreStateInterface) {
    state.isLoggedIn = true
  },
  unsetLoginFlag (state: AuthStoreStateInterface) {
    state.isLoggedIn = false
  }

}
const actions = {
  async logout ({ commit, dispatch }: {commit: Commit, dispatch: Dispatch}) {
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
  async logoutAll ({ commit, dispatch }: {commit: Commit, dispatch: Dispatch}) {
    const data = await handleDELETESignOutAll()
    if (data) {
      dispatch('notification/notifySuccess', data.message)
    }
    commit('unsetLoginFlag')
    commit('removeToken')
    ldb.token.clear()
    ldb.reset()
    resetBaseURL()
  },
  async requestRedirectionToken ({ commit }: {commit: Commit}) {
    commit('setLoadingTrue')
    const postRedirectionTokenResponse = await handlePOSTRedirection()
    commit('setLoadingFalse')
    return postRedirectionTokenResponse
  },
  async redirectionLogin ({ commit }: {commit: Commit}, payload: string) {
    ldb.reset()
    commit('signInLoaderFlagOn')
    const patchRedirectionResponse = await handlePATCHRedirectedAuthentication({ token: payload })
    commit('signInLoaderFlagOff')
    if (patchRedirectionResponse.status !== 201) {
      return false
    }
    commit('setToken', patchRedirectionResponse.data.token)
    commit('setMyProfile', patchRedirectionResponse.data.donor)
    commit('setLoginFlag')
    commit('saveTokenToLocalStorage')
    return true
  },
  async autoLogin ({ commit, state }: {commit: Commit, state: AuthStoreStateInterface} ) {
    commit('loadTokenFromLocalStorage')
    if (state.token === null) return true

    commit('signInLoaderFlagOn')
    const response = await handleGETDonorsMe()
    commit('signInLoaderFlagOff')

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
  async checkToken ({ commit }: {commit: Commit}) {
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
  async guestLogin ({ dispatch }: {dispatch: Dispatch}) {
    enableGuestAPI()
    await dispatch('login', { phone: '123465', password: 'oseihgfweoisng', rememberFlag: false })
  },

  async login ({ commit, dispatch }: { commit: Commit, dispatch: Dispatch}, payload:{phone: string, password: string, rememberFlag: boolean}) {
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
    commit('setMyProfile', donor)

    if (payload.rememberFlag) {
      commit('saveTokenToLocalStorage')
    } else {
      ldb.token.clear()
    }
    commit('setLoginFlag')
    dispatch('notification/notifySuccess', data.message)
    return true
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
