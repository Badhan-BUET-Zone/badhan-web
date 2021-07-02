import {badhanAxios, resetBaseURL} from '@/api';
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
    async savePassword({commit,getters,rootState,rootGetters, dispatch},payload){
        commit('clearPasswordMessage');
        commit('passwordLoaderOn');

        try {
            let response = await badhanAxios.patch("/donors/password", payload);
            if(payload.logoutFlag){
                commit('removeToken',{},{root:true});
                commit('removeTokenFromLocalStorage',{},{root:true});
                commit('unsetLoginFlag',{},{root: true});
                dispatch('notification/notifySuccess',"Successfully changed password. Login again to continue",{root:true});
            }else{
                dispatch('notification/notifySuccess',"Successfully changed password. User will be logged out",{root:true});
            }

            return true;
        } catch (error) {
            return false;
        } finally {
            commit('passwordLoaderOff');
            resetBaseURL();
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
