import {badhanAxios} from '@/api';
const state = {
    statistics: null,
    statisticsLoaderFlag: false,

    logs: [],
    logsLoaderFlag: false,

    logDeleteFlag: false
};

const getters = {
    getStatistics: state => {
        return state.statistics;
    },
    getStatisticsLoaderFlag: state => {
        return state.statisticsLoaderFlag;
    },

    getLogs: state=>{
        return state.logs;
    },



    getLogsLoaderFlag: state=>{
        return state.logsLoaderFlag
    },

    getLogDeleteFLag: state=>{
        return state.logDeleteFlag
    }
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

    setLogs(state,payload){
        state.logs = payload;
    },
    unsetLogs(state){
        state.logs = [];
    },
    setLogsLoaderFlag(state){
        state.logsLoaderFlag = true;
    },
    unsetLogsLoaderFlag(state){
        state.logsLoaderFlag = false;
    },
    setLogDeleteFlag(state){
        state.logDeleteFlag = true;
    },
    unsetLogDeleteFlag(state){
        state.logDeleteFlag = false;
    }
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
    async fetchLogs({commit,getters}){
        commit('unsetLogs');
        commit('setLogsLoaderFlag');
        try{
            let response = await badhanAxios.get('/v1/log');
            commit('setLogs',response.data.logs);
        }catch(e){

        }finally {
            commit('unsetLogsLoaderFlag');
        }
    },
    async removeAllLogs({commit,dispatch}){
        commit('setLogDeleteFlag');
        try{
            let response = await badhanAxios.delete('/v1/log');
            dispatch('fetchLogs');
        }catch(e){

        }finally {
            commit('unsetLogDeleteFlag');
        }
    },
    async getFilteredLogs({commit,dispatch,getters},date){
        console.log(date);
        return getters.getLogs;
    },

};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,
}
