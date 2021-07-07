import {badhanAxios} from '/src/api'

const state = {
    //SEE DONOR DETAILS
    name: null,
    studentId: null,
    lastDonation: null,
    bloodGroup: null,
    hall: null,
    phone: null,
    address: null,
    comment: null,
    designation: null,
    roomNumber: null,
    donationCount: 0,
    commentTime: 0,

    //
    donorLoaderFlag: true,
    donorDetailsError: null,


};
const getters = {
    //SEE DETAILS
    getProfile: state => {
        return {
            name: state.name,
            studentId: state.studentId,
            lastDonation: state.lastDonation,
            bloodGroup: state.bloodGroup,
            hall: state.hall,
            phone: state.phone,
            address: state.address,
            comment: state.comment,
            designation: state.designation,
            roomNumber: state.roomNumber,
            donationCount: state.donationCount,
            commentTime: state.commentTime,
        }
    }
    ,
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
        state.name = payload.name;
        state.studentId = payload.studentId;
        state.lastDonation = payload.lastDonation;
        state.bloodGroup = payload.bloodGroup;
        state.hall = payload.hall;
        state.phone = payload.phone;
        state.address = payload.address;
        state.comment = payload.comment;
        state.designation = payload.designation;
        state.roomNumber = payload.roomNumber;
        state.donationCount = payload.donationCount;
        state.commentTime = payload.commentTime;

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
            commit('setProfile', response.data.donor)
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
