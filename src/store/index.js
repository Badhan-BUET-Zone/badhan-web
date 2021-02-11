import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadingFlag: false,

    token:"",
    designation:'',
    phone: 0,
    hall:-1,

    pageBody:"sign-in"
  },



  getters: {
    getLoadingFlag: state =>{
      return state.loadingFlag
    },
    getToken: state=>{
      return state.token
    },
    getDesignation: state=>{
      return state.designation
    },
    getPhone: state=>{
      return state.phone
    },
    getHall: state=>{
      return state.hall
    },
    getPageBody: state=>{
      return state.pageBody;
    },

  },




  mutations: {
    setLoadingTrue (state) {
      state.loadingFlag=true;
    },
    setLoadingFalse(state){
      state.loadingFlag=false;
    },
    setToken(state,token){
      state.token = token;
    },
    setDesignation(state,designation){
      state.designation = designation;
    },
    setPhone(state,phone){
      state.phone = phone;
    },
    setHall(state,hall){
      state.hall = hall;
    },


    showHallAdminPanel(state){
      state.pageBody="hall-admin-panel";
    },
    showSuperAdminPanel(state){
      state.pageBody="super-admin-panel";
    },
    showSignIn(state){
      state.pageBody="sign-in";
    },
    showSearchPanel(state){
      state.pageBody="search-panel";
    },
    signOut(state) {
      state.token="";
      state.designation="";
    }


  }
})
