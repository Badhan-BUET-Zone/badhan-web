import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import myprofile from './myprofile'
import halladmin from './halladmin'
import home from './home'
import superadmin from './superadmin'
import details from './details'
import userDetails from './userDetails'
import notification from './notification'
import statistics from './statistics'
import consoleStore from './consoleStore'
import messageBox from './messageBox'
import members from './members'
import publicContacts from './publicContacts'
import frontendSettings from './frontendSettings'
import activeDonors from './activeDonors'
import confirmationBox from './confirmationBox'
import donation from './donation'
import donate from './donate'
import comment from './comment'
import callrecord from './callrecord'

Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {
    loadingFlag: false,
    appBarLoadingFlag: false,
    apiPendingCount: 0
  },

  getters: {
    getLoadingFlag: state => {
      return state.loadingFlag
    },
    getAppBarLoadingFlag: state => {
      return state.appBarLoadingFlag
    }
  },
  mutations: {
    setLoadingTrue (state) {
      state.loadingFlag = true
    },
    setLoadingFalse (state) {
      state.loadingFlag = false
    },
    setAppBarLoadingFlag (state) {
      state.apiPendingCount++;
      state.appBarLoadingFlag = true
    },
    unsetAppBarLoadingFlag (state) {
      if (state.apiPendingCount > 0) {
        state.apiPendingCount--;
        state.appBarLoadingFlag = (state.apiPendingCount > 0);
      }
    }
  },
  modules: {
    auth,
    myprofile,
    halladmin,
    home,
    superadmin,
    details,
    userDetails,
    notification,
    statistics,
    consoleStore,
    messageBox,
    confirmationBox,
    members,
    publicContacts,
    frontendSettings,
    activeDonors,
    donation,
    comment,
    callrecord,
    donate
  }
})

store.commit('loadTokenFromLocalStorage')
store.commit('loadMyProfileFromLocalStorage')
