import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import auth from '@/store/auth';
import myprofile from '@/store/myprofile';
import halladmin from '@/store/halladmin';
import home from '@/store/home';
import superadmin from '@/store/superadmin';

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
    superadmin
  }
});
