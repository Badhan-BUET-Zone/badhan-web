import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import auth from './auth';
import myprofile from './myprofile';
import halladmin from './halladmin';
import home from './home';
import superadmin from './superadmin';
import details from './home/details';
import userDetails from './userDetails';
import notification from "./notification";
import release from "./release";
import statistics from "./statistics";
import errorStore from "./errorStore";
import consoleStore from "./consoleStore";
import messageBox from "./messageBox";
import members from "./members";
import publicContacts from "./publicContacts";
import frontendSettings from "./frontendSettings";
import personModal from "./personModal";

export const store = new Vuex.Store({

  state: {
    loadingFlag: false,
  },

  getters: {
    getLoadingFlag: state =>{
      return state.loadingFlag
    },
  },
  mutations: {
    setLoadingTrue (state) {
      state.loadingFlag=true;
    },
    setLoadingFalse(state){
      state.loadingFlag=false;
    },
  },
  modules:{
    auth,
    myprofile,
    halladmin,
    home,
    superadmin,
    details,
    userDetails,
    notification,
    release,
    statistics,
    errorStore,
    consoleStore,
    messageBox,
    members,
    publicContacts,
    frontendSettings,
    personModal
  }
});
