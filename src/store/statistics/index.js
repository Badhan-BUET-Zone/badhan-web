import {badhanAxios,firebaseAxios} from '@/api';
const state = {
    statistics: null,
    statisticsLoaderFlag: false,

    logs: [],
    logsLoaderFlag: false,

    logDeleteFlag: false,

    volunteers: [],
    volunteerLoaderFlag: false,

    credits: null,
    creditsLoaderFlag: false,
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
        return state.logsLoaderFlag;
    },

    getLogDeleteFLag: state=>{
        return state.logDeleteFlag;
    },

    getVolunteers: state=>{
        return state.volunteers;
    },
    getVolunteerLoaderFlag: state=>{
        return state.volunteerLoaderFlag
    },

    getCredits: state=>{
        return state.credits;
    },
    getCreditsLoaderFlag: state=>{
        return state.creditsLoaderFlag;
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
    },

    setVolunteers(state,payload){
        state.volunteers = payload;
    },
    unsetVolunteers(state){
        state.volunteers = [];
    },
    setVolunteerLoaderFlag(state){
        state.volunteerLoaderFlag = true;
    },
    unsetVolunteerLoaderFlag(state){
        state.volunteerLoaderFlag = false;
    },

    setCredits(state,payload){
        state.credits = payload;
    },
    setCreditsLoader(state){
        state.creditsLoaderFlag = true;
    },
    unsetCreditsLoader(state){
        state.creditsLoaderFlag = false;
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

    async fetchAllVolunteers({commit}){
        commit('setVolunteerLoaderFlag');
        commit('unsetVolunteers');
        try{
            let response = await badhanAxios.get('/volunteers/all')
            commit('setVolunteers',response.data.data);
        }catch(e){

        }finally{
            commit('unsetVolunteerLoaderFlag');
        }
    },

    async fetchCredits({commit}){
        commit('setCreditsLoader');
        try{
            let response = await firebaseAxios.get('/contributors.json')
            commit('setCredits',response.data);
        }catch (e){

        }finally{
            commit('unsetCreditsLoader');
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
