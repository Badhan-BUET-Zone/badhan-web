import {badhanAxios} from "@/api";
import {handleGETVolunteers, handlePOSTDonors, handlePOSTDonations} from "../../api";

const state = {
    volunteers: [],
    volunteerError: null,
    volunteerLoader: false,

    newDonorLoader: false,
    newDonorError: null,
    newDonorSuccess: null,
};

const getters = {
    getVolunteers: state => {
        return state.volunteers;
    },
    getVolunteerError: state => {
        return state.volunteerError;
    },
    getVolunteerLoader: state => {
        return state.volunteerLoader;
    },

    getNewDonorLoader: state => {
        return state.newDonorLoader;
    },
    getNewDonorError: state => {
        return state.newDonorError;
    },
    getNewDonorSuccess: state => {
        return state.newDonorSuccess;
    }


};
const mutations = {
    setVolunteers(state, payload) {
        state.volunteers = payload;
    },
    clearVolunteers(state) {
        state.volunteers = [];

    },
    setVolunteerError(state, payload) {
        state.volunteerError = payload;
    },
    clearVolunteerError(state) {
        state.volunteerError = null;
    },
    volunteerLoaderOn(state) {
        state.volunteerLoader = true;
    },
    volunteerLoaderOff(state) {
        state.volunteerLoader = false;
    },


    newDonorLoaderOn(state) {
        state.newDonorLoader = true;
    },
    newDonorLoaderOff(state) {
        state.newDonorLoader = false;
    },

    setNewDonorError(state, payload) {
        state.newDonorError = payload;
    },
    setNewDonorSuccess(state, payload) {
        state.newDonorSuccess = payload;
    },
    clearNewDonorMessage(state) {
        state.newDonorError = null;
        state.newDonorSuccess = null;
    },

};
const actions = {
    async fetchVolunteers({commit, getters}) {
        commit('clearVolunteers');
        commit('volunteerLoaderOn');
        let volunteers = await handleGETVolunteers();
        commit('volunteerLoaderOff');
        if (!volunteers) return;
        volunteers.sort((a, b) => (a.studentId > b.studentId) ? 1 : -1)
        commit('setVolunteers', volunteers);
    },
    async saveDonor({commit, getters, dispatch}, payload) {
        commit('newDonorLoaderOn');

        let response = await handlePOSTDonors(payload);

        if (response.status !== 201) {
            commit('newDonorLoaderOff')
            return response;
        }

        if (payload.lastDonation !== 0) {
            let donationData = {
                donorId: response.data.newDonor._id,
                date: payload.lastDonation,
            };
            await handlePOSTDonations(donationData);
        }
        commit('newDonorLoaderOff')
        dispatch('notification/notifySuccess', "Donor added successfully", {root: true});
        return response;
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true
}
