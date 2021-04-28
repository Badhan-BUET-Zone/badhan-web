import {badhanAxios} from '@/api';
const state = {
    donationLoaderFlag: false,

    donationError: null,
    donationSuccess: null,
};

const getters = {
    getDonationLoaderFlag: state=>{
        return state.donationLoaderFlag
    },
    getDonationError: state=>{
        return state.donationError
    },
    getDonationSuccess: state=>{
        return state.donationSuccess
    }
};
const mutations = {
    donationLoaderFlagOn(state){
        state.donationLoaderFlag=true;
    },
    donationLoaderFlagOff(state){
        state.donationLoaderFlag=false;
    },
    setDonationError(state,payload){
        state.donationError = payload;
    },
    setDonationSuccess(state,payload){
        state.donationSuccess = payload;
    },
    clearDonationMessage(state){
        state.donationSuccess = null;
        state.donationError = null;

    }
};
const actions = {
    async donate({ commit, getters,rootState, rootGetters, dispatch},payload){
        commit('donationLoaderFlagOn');
        let sendData = {
            // donorPhone: this.$props.phone,
            donorId: payload.donorId,
            date: new Date(payload.newDonationDate).getTime(),
        };

        try {
            let response = await badhanAxios.post("v2/donation/insert", sendData);
            dispatch('notification/notifySuccess',"Successfully added donation",{root: true});
            return true;
        } catch (error) {
            return false;
        } finally {
            commit('donationLoaderFlagOff');
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