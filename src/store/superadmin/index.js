import {badhanAxios} from '@/api';
const state = {
    hallAdmins: null,
    hallAdminsLoaderFlag: false,
    hallAdminsFetchError: null,

    changeAdminLoaderFlag: false,
    changeAdminError: null,
    changeAdminSuccess: null,
};

const getters = {
    getHallAdmins: state => {
        return state.hallAdmins;
    },
    getHallAdminsLoaderFlag: state=>{
        return state.hallAdminsLoaderFlag;
    },
    getHallAdminsFetchError: state=>{
        return state.hallAdminsFetchError;
    },

    getChangeAdminLoaderFlag: state=>{
        return state.changeAdminLoaderFlag;
    },
    getChangeAdminError: state=>{
        return state.changeAdminError;
    },
    getChangeAdminSuccess: state=>{
        return state.changeAdminSuccess;
    }
};
const mutations = {
    setHallAdmins(state, payload) {
        state.hallAdmins = payload;
    },
    setHallAdminsFetchError(state,payload){
        state.hallAdminsFetchError = payload;
    },
    clearHallAdminsFetchError(state){
        state.hallAdminsFetchError = null;
    },
    hallAdminsLoaderFlagOn(state){
        state.hallAdminsLoaderFlag = true;
    },
    hallAdminsLoaderFlagOff(state){
        state.hallAdminsLoaderFlag = false;
    },

    setChangeAdminError(state,payload){
        state.changeAdminError = payload;
    },
    clearChangeAdminError(state){
        state.changeAdminError = null;
    },
    changeAdminLoaderFlagOn(state){
        state.changeAdminLoaderFlag = true;
    },
    changeAdminLoaderFlagOff(state){
        state.changeAdminLoaderFlag = false;
    },
    setChangeAdminSuccess(state,payload){
        state.changeAdminSuccess = payload;
    },
    clearChangeAdminSuccess(state){
        state.changeAdminSuccess = null;
    }

};
const actions = {
    async fetchHallAdmins({ commit }) {
        commit('hallAdminsLoaderFlagOn');
        try {
            let response = await badhanAxios.get('/admins');
            commit('setHallAdmins',response.data.admins)
        } catch (error) {
        } finally {
            commit('hallAdminsLoaderFlagOff');
        }
    },

    async changeHallAdmin({commit,getters,dispatch},payload){
            commit('changeAdminLoaderFlagOn');
            try {
                let response = await badhanAxios.patch('/admins', payload);
                dispatch('notification/notifySuccess',"Successfully changed hall admin");

                return true;

            } catch (error) {
                return false;
            } finally {
                commit('changeAdminLoaderFlagOff');
            }
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}
