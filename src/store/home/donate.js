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
    async donate({ commit, getters,rootState, rootGetters},payload){
        commit('clearDonationMessage');
        commit('donationLoaderFlagOn');

        let sendData = {
            // donorPhone: this.$props.phone,
            donorPhone: payload.phone,
            date: new Date(payload.newDonationDate).getTime(),
        };
        let headers = {
            "x-auth": rootGetters.getToken,
        };

        try {
            let response = await badhanAxios.post("/donation/insert", sendData, {
                headers: headers,
            });

            commit('setDonationSuccess',"Successfully added donation");
            return true;
        } catch (error) {
            if(error.response && error.response.data){
                commit('setDonationError',error.response.data.message);
            }else{
                commit('setDonationError',error);
            }
            console.log(error.response);
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