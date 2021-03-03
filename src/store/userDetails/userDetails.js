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
    async saveUserDetails({commit,getters,rootState,rootGetters},payload){

        commit('detailsLoaderFlagOn');
        let headers = {
            "x-auth": rootGetters.getToken,
        };
        console.log("REQUEST TO /donor/edit: ", payload);

        try {
            let response = await badhanAxios.post("/donor/edit", payload, {
                headers: headers,
            });
            console.log("RESPONSE FROM /donor/edit: ", response);

            commit('setDetailsSuccess',"Successfully saved details.");
            commit("setPhone", parseInt(payload.newPhone),{root:true});
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                commit('setDetailsError',error.response.data.message);
            }else{
                commit('setDetailsError',error);
            }
            console.log(error.response);
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