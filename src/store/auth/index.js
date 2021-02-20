import axios from 'axios';
import router from '@/router/';
const state={
    hello: "my name is mahathir",
    token:null,
    signInLoaderFlag: false,
    error: "",

};

const getters={
    getHello: state=>{
        return state.hello;
      },
      getToken: state=>{
        return state.token
      },
      getError: state=>{
          return state.error
      },
      getSignInLoaderFlag: state=>{
          return state.signInLoaderFlag
      }
};
const mutations={
    setToken(state,token){
        state.token = token;
      },
      
  
      signOut(state) {
        state.token=null;
        state.designation="";
      },

      signInLoaderFlagOn(state){
        state.signInLoaderFlag = true;
      },

      signInLoaderFlagOff(state){
        state.signInLoaderFlag = false;
      },

      setSignInError(state,payload){
        state.error = payload;
      },
      clearSignInError(state){
          state.error = "";
      }
};
const actions={
    async login({getters,commit},payload){

        commit('signInLoaderFlagOn');
        try {
            let sendData = {
                phone: parseInt('88' + payload.phone),
                password: payload.password
            };
            console.log("REQUEST POST TO /users/signin: HIDDEN");
            let response = await axios.post('/users/signin', sendData);

            console.log("RESPONSE FROM /users/signin: ", response);

            if (response.status !== 201) {
                commit('setSignInError',"Status code not 201")
                return;
            }

            commit('setToken', response.data.token);

            let headers = {
                'x-auth': getters.getToken
            };
            sendData = {
                donorPhone: parseInt('88' + payload.phone)
            };

            console.log("REQUEST POST TO /donor/details: ", sendData);
            let profileInfo = await axios.post('/donor/details', sendData, {headers: headers});

            console.log("RESPONSE FROM /donor/details: ", profileInfo);

            commit('setMyProfile',profileInfo.data.donor);

            

            if (payload.rememberFlag === true) {
                localStorage.setItem('phone', payload.phone);
                localStorage.setItem('password', payload.password);
            } else {
                console.log("REMOVED CREDENTIALS")
                localStorage.removeItem('phone');
                localStorage.removeItem('password');
            }

            return true;

        } catch (error) {
            console.log(error);
            commit('setSignInError',error.response.data.message);

            return false;
        } finally {
            commit('signInLoaderFlagOff');
        }
    }
};


export default{
    state,
    actions,
    getters,
    mutations
}