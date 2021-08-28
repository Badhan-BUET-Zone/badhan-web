import {handlePATCHDonors} from '../../api';

const state = {
    detailsLoaderFlag: false,
    detailsError: null,
    detailsSuccess: null,
};

const getters = {
    getDetailsLoaderFlag: state => {
        return state.detailsLoaderFlag;
    },
    getDetailsError: state => {
        return state.detailsError;
    },
    getDetailsSuccess: state => {
        return state.detailsSuccess;
    },
};
const mutations = {
    detailsLoaderFlagOn(state) {
        state.detailsLoaderFlag = true;
    },
    detailsLoaderFlagOff(state) {
        state.detailsLoaderFlag = false;
    },
    setDetailsError(state, payload) {
        state.detailsError = payload;
    },
    setDetailsSuccess(state, payload) {
        state.detailsSuccess = payload;
    },
    clearDetailsMessage(state) {
        state.detailsError = null;
        state.detailsSuccess = null;
    },
};
const actions = {
    async saveUserDetails({commit, getters, rootState, rootGetters, dispatch}, payload) {
        commit('detailsLoaderFlagOn');
        let response = await handlePATCHDonors(payload);
        commit('detailsLoaderFlagOff');
        if (response.status !== 200) return;
        dispatch('notification/notifySuccess', "Successfully saved details", {root: true})
        commit("setPhone", parseInt(payload.newPhone), {root: true});
    }
};
export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
