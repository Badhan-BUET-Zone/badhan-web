import {handlePOSTDonations} from '../../api';

const state = {
    donationLoaderFlag: false,
};

const getters = {
    getDonationLoaderFlag: state => {
        return state.donationLoaderFlag
    },
};
const mutations = {
    donationLoaderFlagOn(state) {
        state.donationLoaderFlag = true;
    },
    donationLoaderFlagOff(state) {
        state.donationLoaderFlag = false;
    },
};
const actions = {
    async donate({commit, getters, rootState, rootGetters, dispatch}, payload) {
        let sendData = {
            donorId: payload.donorId,
            date: new Date(payload.newDonationDate).getTime(),
        };
        commit('donationLoaderFlagOn');
        let response = await handlePOSTDonations(sendData);
        commit('donationLoaderFlagOff');
        if (response.status !== 201) return false;
        dispatch('notification/notifySuccess', "Successfully added donation", {root: true});
        return true;
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
