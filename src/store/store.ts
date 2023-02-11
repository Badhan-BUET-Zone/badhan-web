/* eslint-disable */
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
import githubRelease from './githubRelease'

Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {
    loadingFlag: false
  },

  getters: {
    getLoadingFlag: state => {
      return state.loadingFlag
    }
  },
  mutations: {
    setLoadingTrue (state) {
      state.loadingFlag = true
    },
    setLoadingFalse (state) {
      state.loadingFlag = false
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
    donate,
    githubRelease
  }
})
