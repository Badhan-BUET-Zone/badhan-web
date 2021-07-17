import {badhanAxios} from '/src/api'

const state = {
    //SEE DONOR DETAILS

    profile: null,

    //
    donorLoaderFlag: true,
    donorDetailsError: null,


};
const getters = {
    //SEE DETAILS
    getProfile: state => {
        return state.profile
    },
    getDonorLoaderFlag: state => {
        return state.donorLoaderFlag;
    },
    getDonorDetailsError: state => {
        return state.donorDetailsError;
    }
};
const mutations = {
    //SEE DETAILS
    setProfile(state, payload) {
        state.profile = payload;
    },

    donorLoaderFlagOn(state) {
        state.donorLoaderFlag = true;
    },
    donorLoaderFlagOff(state) {
        state.donorLoaderFlag = false;
    },

    setDonorDetailsError(state, payload) {
        state.donorDetailsError = payload;
    },
    clearDonorDetailsError(state) {
        state.donorDetailsError = null;
    }

};
const actions = {
    async getDetails({commit, getters, rootState, rootGetters, dispatch}, payload) {
        let params = {
            donorId: payload
        };
        commit('donorLoaderFlagOn');
        try {
            let response = await badhanAxios.get('/donors', {params});
            commit('setProfile', response.data.donor);
            commit('callrecord/setCallRecords',response.data.donor.callRecords,{root: true});
            commit('donation/setDonationList',response.data.donor.donations.map(a => a.date),{root:true});
            return true;
        } catch (error) {
            return false;
        } finally {
            commit('donorLoaderFlagOff');
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
