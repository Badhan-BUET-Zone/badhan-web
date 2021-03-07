import {badhanAxios} from '@/api';
const state = {
    lastDonation:0,
    donationList:[],

    donationLoader: false,
    donationDeleteLoader: false,

    donationError: null,
    donationSuccess: null,
};

const getters = {
    getLastDonation: state=>{
        return state.lastDonation;
    },
    getDonationList: state=>{
        return state.donationList;
    },
    getDonationLoader: state=>{
        return state.donationLoader;
    },
    getDonationDeleteLoader: state=>{
        return state.donationDeleteLoader;
    },
    getDonationError: state=>{
        return state.donationError;
    },
    getDonationSuccess: state=>{
        return state.donationSuccess;
    }
};
const mutations = {
    setLastDonation(state,payload){
        state.lastDonation = payload;
    },
    setDonationList(state,payload){
        state.donationList = payload;
    },
    clearDonationList(state){
        state.donationList = [];
    },
    donationLoaderOn(state){
        state.donationLoader = true;
    },
    donationLoaderOff(state){
        state.donationLoader = false;
    },
    donationDeleteLoaderOn(state){
        state.donationDeleteLoader = true;
    },
    donationDeleteLoaderOff(state){
        state.donationDeleteLoader = false;
    },
    setDonationError(state,payload){
        state.donationError = payload;
    },
    setDonationSuccess(state,payload){
        state.donationSuccess = payload;
    },
    clearDonationMessage(state){
        state.donationError = null;
        state.donationSuccess = null;

    }


};
const actions = {
    async fetchDonationHistory({commit,getters,rootState,rootGetters},payload){
        commit('clearDonationMessage');
        commit('donationLoaderOn');

        let sendData = {
            donorPhone: parseInt("88" + payload.phone),
        };
        let headers = {
            "x-auth": rootGetters.getToken,
        };
        console.log("REQUEST TO /donor/donations: ", sendData);

        try {
            let response = await badhanAxios.post("/donor/donations", sendData, {
                headers: headers,
            });

            commit('setDonationList',response.data.donations);
            commit('setDonationSuccess',"Successfully loaded history");
        } catch (error) {
            if(error.response && error.response.data){
                commit('setDonationError',error.response.data.message);
            }else{
                commit('setDonationError',error);
            }

            console.log(error.response);
        } finally {
            commit('donationLoaderOff');
        }
    },
    async deleteDonation({commit,getters,rootState,rootGetters},payload){
        commit('clearDonationMessage');
        commit('donationDeleteLoaderOn');

        let dateToBeDeleted = payload.date;
        let sendData = {
            donorPhone: parseInt("88" + payload.phone),
            date: payload.date,
        };
        let headers = {
            "x-auth": rootGetters.getToken,
        };

        try {
            let response = await badhanAxios.post("/donation/delete", sendData, {
                headers: headers,
            });

            let history = getters['getDonationList'];

            for (let i = 0; i < history.length; i++) {
                if (history[i] == dateToBeDeleted) {
                    history.splice(i, 1);
                    break;
                }
            }
            let lastDonationNew = 0;
            if (history.length !== 0) {
                lastDonationNew = history.reduce(function (a, b) {
                    return Math.max(a, b);
                });
            }
            commit('setDonationSuccess',"Successfully deleted donation");
            commit('setDonationList',history);
            return lastDonationNew;


        } catch (error) {
            if(error.response && error.response.data){
                commit('setDonationError',error.response.data.message);
            }else{
                commit('setDonationError',error);
            }
            console.log(error.response);
            return 0;

        } finally {
            commit('donationDeleteLoaderOff');
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