import {handleDELETECallRecord, handlePOSTCallRecord} from '../../api';

const state = {
    callRecords: [],
    callRecordsLoader: false,

    newCallRecordLoaderFlag: false,
    deleteCallRecordLoaderFlag: false,

};

const getters = {
    getCallRecords(state) {
        return state.callRecords;
    },
    getCallRecordsLoader(state) {
        return state.callRecordsLoader;
    },
    getNewCallRecordLoaderFlag(state) {
        return state.newCallRecordLoaderFlag;
    },
    getDeleteCallRecordLoaderFlag(state) {
        return state.deleteCallRecordLoaderFlag;
    },

};
const mutations = {
    callRecordsLoaderOn(state) {
        state.callRecordsLoader = true;
    },
    callRecordsLoaderOff(state) {
        state.callRecordsLoader = false;
    },
    setCallRecords(state, payload) {
        state.callRecords = payload;
    },
    unsetCallRecords(state) {
        state.callRecords = [];
    },
    setNewCallRecordLoaderFlag(state) {
        state.newCallRecordLoaderFlag = true;
    },
    unsetNewCallRecordLoaderFlag(state) {
        state.newCallRecordLoaderFlag = false;
    },
    setDeleteCallRecordLoaderFlag(state) {
        state.deleteCallRecordLoaderFlag = true;
    },
    unsetDeleteCallRecordLoaderFlag(state) {
        state.deleteCallRecordLoaderFlag = false;
    }
};
const actions = {
    async deleteCallRecord({commit, dispatch, getters}, payload) {
        commit('setDeleteCallRecordLoaderFlag');
        let response = await handleDELETECallRecord(payload);
        commit('unsetDeleteCallRecordLoaderFlag');
        if (response.status !== 200) return;
        let callRecords = getters['getCallRecords'];
        callRecords = callRecords.filter((callRecord) => {
            return callRecord._id !== payload.callRecordId
        });
        commit('setCallRecords', callRecords);
        dispatch('notification/notifySuccess', "Successfully deleted call record", {root: true})
    },
    async postCallRecord({commit, dispatch, getters, rootGetters}, payload) {
        commit('setNewCallRecordLoaderFlag');
        let response = await handlePOSTCallRecord(payload);
        commit('unsetNewCallRecordLoaderFlag');
        if (response.status !== 200) return;
        let callRecords = getters['getCallRecords'];
        let name = rootGetters['getName'];
        callRecords.unshift({
            ...response.data.callRecord,
            callerId: {name, hall: rootGetters['getHall'], designation: rootGetters['getDesignation']}
        });
        commit('setCallRecords', callRecords);
        dispatch('notification/notifySuccess', "Added call record", {root: true})
    },
    async postCallRecordFromCard({commit, dispatch}, payload) {
        await handlePOSTCallRecord(payload);
        dispatch('notification/notifySuccess', "Added call record", {root: true})
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
