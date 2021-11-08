import {handleGETActiveDonors} from "../api";

const state = {
    activeDonors: [],
};

const getters = {
    getActiveDonors(state) {
        return state.activeDonors
    },
};
const mutations = {
    setActiveDonors(state, payload) {
        state.activeDonors = payload;

    },
};
const actions = {
    async fetchActiveDonors({commit, dispatch, getters},payload) {
        let activeDonorsResult = await handleGETActiveDonors(payload);
        if(activeDonorsResult.status!==200)return;
        commit('setActiveDonors',activeDonorsResult.data.activeDonors);
    },
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
