import {badhanAxios} from '@/api';
const state = {
    detailsLoaderFlag: false,
    detailsError: null,
    detailsSuccess: null,
};

const getters = {
    getDetailsLoaderFlag: state=>{
        return state.detailsLoaderFlag;
    },
    getDetailsError: state=>{
        return state.detailsError;
    },
    getDetailsSuccess: state=>{
        return state.detailsSuccess;
    },
};
const mutations = {
    detailsLoaderFlagOn(state){
        state.detailsLoaderFlag=true;
    },
    detailsLoaderFlagOff(state){
        state.detailsLoaderFlag=false;
    },
    setDetailsError(state,payload){
        state.detailsError = payload;
    },
    setDetailsSuccess(state,payload){
        state.detailsSuccess = payload;
    },
    clearDetailsMessage(state){
        state.detailsError = null;
        state.detailsSuccess=null;
    },
};
const actions = {
    async saveUserDetails({commit,getters,rootState,rootGetters, dispatch},payload){
        commit('detailsLoaderFlagOn');
        try {
            let response = await badhanAxios.patch("/donors", payload);
            dispatch('notification/notifySuccess',"Successfully saved details",{root:true})
            commit("setPhone", parseInt(payload.newPhone),{root:true});
        } catch (error) {
        } finally {
            commit('detailsLoaderFlagOff');
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
