import {badhanAxios} from '@/api';
const state = {
    passwordLoader: false,
    passwordError: null,
    passwordSuccess: null,
};

const getters = {
    getPasswordLoader: state=>{
        return state.passwordLoader;
    },
    getPasswordError: state=>{
        return state.passwordError;
    },
    getPasswordSuccess: state=>{
        return state.passwordSuccess;
    }
};
const mutations = {
    passwordLoaderOn(state){
        state.passwordLoader = true;
    },
    passwordLoaderOff(state){
        state.passwordLoader = false;
    },
    setPasswordSuccess(state,payload){
        state.passwordSuccess = payload;
    },
    setPasswordError(state,payload){
        state.passwordError = payload;
    },
    clearPasswordMessage(state){
        state.passwordSuccess = null;
        state.passwordError = null;
    }

};
const actions = {
    async savePassword({commit,getters,rootState,rootGetters},payload){
        commit('clearPasswordMessage');
        commit('passwordLoaderOn');

        let sendData = {
            donorPhone: parseInt("88" + payload.phone),
            newPassword: payload.newPassword,
        };
        let headers = {
            "x-auth": rootGetters.getToken,
        };
        console.log("REQUEST TO /donor/password/change: ", sendData);
        try {
            let response = await badhanAxios.post("/donor/password/change", sendData, {
                headers: headers,
            });
            console.log("RESPONSE FROM /donor/password/change: ", response);

            commit('setPasswordSuccess',"Successfully changed password")
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                commit('setPasswordError',error.response.data.message);
            }else{
                commit('setPasswordError',error);
            }
            console.log(error.response);
        } finally {
            commit('passwordLoaderOff');
        }
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,
}