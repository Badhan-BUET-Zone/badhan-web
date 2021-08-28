import {handleGETAdmins, handlePATCHAdmins} from '../../api';

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
    getHallAdminsLoaderFlag: state => {
        return state.hallAdminsLoaderFlag;
    },
    getHallAdminsFetchError: state => {
        return state.hallAdminsFetchError;
    },

    getChangeAdminLoaderFlag: state => {
        return state.changeAdminLoaderFlag;
    },
    getChangeAdminError: state => {
        return state.changeAdminError;
    },
    getChangeAdminSuccess: state => {
        return state.changeAdminSuccess;
    }
};
const mutations = {
    setHallAdmins(state, payload) {
        state.hallAdmins = payload;
    },
    setHallAdminsFetchError(state, payload) {
        state.hallAdminsFetchError = payload;
    },
    clearHallAdminsFetchError(state) {
        state.hallAdminsFetchError = null;
    },
    hallAdminsLoaderFlagOn(state) {
        state.hallAdminsLoaderFlag = true;
    },
    hallAdminsLoaderFlagOff(state) {
        state.hallAdminsLoaderFlag = false;
    },

    setChangeAdminError(state, payload) {
        state.changeAdminError = payload;
    },
    clearChangeAdminError(state) {
        state.changeAdminError = null;
    },
    changeAdminLoaderFlagOn(state) {
        state.changeAdminLoaderFlag = true;
    },
    changeAdminLoaderFlagOff(state) {
        state.changeAdminLoaderFlag = false;
    },
    setChangeAdminSuccess(state, payload) {
        state.changeAdminSuccess = payload;
    },
    clearChangeAdminSuccess(state) {
        state.changeAdminSuccess = null;
    },
    clearHallAdmins(state) {
        state.hallAdmins = null;
    }

};
const actions = {
    async fetchHallAdmins({commit}) {
        commit('hallAdminsLoaderFlagOn');
        let response = await handleGETAdmins()
        commit('hallAdminsLoaderFlagOff');
        if (response.status !== 200) return;
        commit('setHallAdmins', response.data.admins)
    },

    async changeHallAdmin({commit, getters, dispatch}, payload) {
        commit('changeAdminLoaderFlagOn');
        let response = await handlePATCHAdmins(payload);
        commit('changeAdminLoaderFlagOff');
        if (response.status !== 200) return false;
        dispatch('notification/notifySuccess', "Successfully changed hall admin");
        return true;
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}
