import {handleGETDonorsDesignation} from "../api";
import ldb from '../localDatabase';

const state = {
    hallAdmins: [],
    volunteers: [],
    superAdmins: [],
    memberLoaderFlag: false,
};

const getters = {
    getHallAdmins(state) {
        return state.hallAdmins
    },
    getVolunteers(state) {
        return state.volunteers;
    },
    getSuperAdmins(state) {
        return state.superAdmins;
    },
    getMemberLoaderFlag(state) {
        return state.memberLoaderFlag;
    }
};
const mutations = {
    assignMembers(state, payload) {
        state.hallAdmins = payload.adminList;
        state.superAdmins = payload.superAdminList;
        state.volunteers = payload.volunteerList;
    },
    memberLoaderFlagOn(state) {
        state.memberLoaderFlag = true;
    },
    memberLoaderFlagOff(state) {
        state.memberLoaderFlag = false;
    }
};
const actions = {
    async fetchMembers({commit, dispatch, getters}) {
        let cachedMemberResult = ldb.members.load();
        if (cachedMemberResult.status === "OK" ) {
            commit('assignMembers',cachedMemberResult.data);
            return;
        } else if (cachedMemberResult.status === "ERROR") {
            commit('memberLoaderFlagOn');
        }else if (cachedMemberResult.status === "EXPIRED"){
            commit('assignMembers',cachedMemberResult.data);
        }
        let response = await handleGETDonorsDesignation();
        commit('memberLoaderFlagOff');
        if (response.status !== 200) return;
        commit('assignMembers', response.data);
        ldb.members.save(response.data);
    },
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
