import {badhanAxios} from '@/api';
const state = {
    statistics: null,
    statisticsLoaderFlag: false,
};

const getters = {
    getStatistics: state => {
        return state.statistics;
    },
    getStatisticsLoaderFlag: state => {
        return state.statisticsLoaderFlag;
    },
};
const mutations = {
    setStatistics(state, payload) {
        state.statistics = payload;
    },
    unsetStatistics(state){
        state.statistics = null;
    },
    setStatisticsLoaderFlag(state){
        state.statisticsLoaderFlag = true;
    },
    unsetStatisticsLoaderFlag(state){
        state.statisticsLoaderFlag = false;
    },
};
const actions = {
    async fetchStatistics({ commit, getters }) {
        commit('unsetStatistics');
        commit('setStatisticsLoaderFlag');
        try{
            let response = await badhanAxios.get('/v2/log/statistics');
            commit('setStatistics',response.data.statistics);
        }catch(e){

        }finally {
            commit('unsetStatisticsLoaderFlag');
        }
    },

};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,
}
