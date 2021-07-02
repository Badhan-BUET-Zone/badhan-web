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
    async promote({commit,getters,rootState,rootGetters,dispatch},payload){
        commit('promoteFlagOn');
        try {
            let response = await badhanAxios.patch("/donors/designation", payload);
            dispatch('notification/notifySuccess',response.data.message,{root:true});
            return true;

        } catch (error) {
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
