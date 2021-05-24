import {badhanAxios} from '@/api';

const state = {
    appDetails: null,
    appDetailsLoader: false,
};

const getters = {
    getAppDetails(state){
        return state.appDetails;
    },
    getAppDetailsLoader(state){
        return state.appDetailsLoader;
    }

};
const mutations = {
    setAppDetails(state, payload){
        state.appDetails = payload;
    },
    setAppDetailsLoader(state){
        state.appDetailsLoader = true;
    },
    unsetAppDetailsLoader(state){
        state.appDetailsLoader = false;
    }
};
const actions = {
    async fetchtAppDetails({commit,getters,rootState,rootGetters, dispatch}){
        commit('setAppDetailsLoader');
        try{
            return await badhanAxios('/v3/log/version');
        }catch (e){

        }finally {
            commit('unsetAppDetailsLoader');
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
