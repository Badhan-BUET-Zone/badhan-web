import {badhanAxios} from '@/api';
const state = {
    promoteFlag: false,
    promoteSuccess: null,
    promoteError: null
};

const getters = {
    getPromoteFlag: state=>{
        return state.promoteFlag;
    },
    getPromoteSuccess: state=>{
        return state.promoteSuccess;
    },
    getPromoteError: state=>{
        return state.promoteError;
    }
};
const mutations = {
    promoteFlagOn(state){
        state.promoteFlag=true;
    },
    promoteFlagOff(state){
        state.promoteFlag=false;
    },
    clearPromoteMessage(state){
        state.promoteSuccess=null;
        state.promoteError=null;
    },
    setPromoteError(state,payload){
        state.promoteError=payload;
    },
    setPromoteSuccess(state,payload){
        state.promoteSuccess=payload;
    }

};
const actions = {
    async promote({commit,getters,rootState,rootGetters},payload){

        commit('promoteFlagOn');

        try {
            let response = await badhanAxios.post("v2/admin/promote", payload);

            if(payload.promoteFlag){
                commit('setPromoteSuccess',"Successfully promoted to volunteer");

            }else{
                commit('setPromoteSuccess',"Successfully demoted");
            }

            return true;

        } catch (error) {
            if(error.response && error.response.data) {
                commit('setPromoteError', error.response.data.message);
            }else{
                commit('setPromoteError', error);
            }

            console.log(error.response);
            return false;
        } finally {
            commit('promoteFlagOff');
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