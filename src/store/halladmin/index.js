import {handleGETVolunteers, handlePOSTDonors, handlePOSTDonations} from "../../api";

const state = {
    volunteers: [],
    volunteerLoader: false,
    newDonorLoader: false,
};

const getters = {
    getVolunteers: state => {
        return state.volunteers;
    },
    getVolunteerLoader: state => {
        return state.volunteerLoader;
    },
    getNewDonorLoader: state => {
        return state.newDonorLoader;
    },
};
const mutations = {
    setVolunteers(state, payload) {
        state.volunteers = payload;
    },
    clearVolunteers(state) {
        state.volunteers = [];

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
