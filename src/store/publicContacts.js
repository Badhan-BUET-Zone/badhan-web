import {handleGETPublicContacts,isGuestEnabled} from "../api";
import ldb from '../localDatabase';

const state = {
    publicContacts: [],
    publicContactsLoaderFlag: false,
};

const getters = {
    getPublicContacts(state) {
        return state.publicContacts
    },
    getPublicContactsLoaderFlag(state) {
        return state.publicContactsLoaderFlag;
    }
};
const mutations = {
    setPublicContacts(state, payload) {
        state.publicContacts = payload.publicContacts;

    },
    publicContactsLoaderFlagOn(state) {
        state.publicContactsLoaderFlag = true;
    },
    publicContactsLoaderFlagOff(state) {
        state.publicContactsLoaderFlag = false;
    }
};
const actions = {
    async fetchPublicContacts({commit, dispatch, getters}) {
        let cachedPublicContactResult = ldb.publicContacts.load();
        if (cachedPublicContactResult.status === "OK" ) {
            commit('setPublicContacts',cachedPublicContactResult.data);
            return;
        } else if (cachedPublicContactResult.status === "ERROR") {
            commit('publicContactsLoaderFlagOn');
        }else if (cachedPublicContactResult.status === "EXPIRED"){
            commit('setPublicContacts',cachedPublicContactResult.data);
        }
        // commit('publicContactsLoaderFlagOn');
        let response = await handleGETPublicContacts();
        commit('publicContactsLoaderFlagOff');
        if (response.status !== 200) return;
        commit('setPublicContacts', response.data);

        if(isGuestEnabled())return;
        ldb.publicContacts.save(response.data);
    },
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
