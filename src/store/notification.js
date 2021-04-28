import {badhanAxios} from '@/api';
const state = {
    notificationFlag: false,
    notification: null,
};

const getters = {
    getNotification(state){
        return state.notification
    },
    getNotificationFlag(state){
        return state.notificationFlag;
    }
};
const mutations = {
    setNotification(state, payload){
        state.notification = payload;
    },
    setNotificationFlag(state,payload){
        state.notificationFlag = payload;
    }
};
const actions = {
    notify({commit,getters,rootState,rootGetters},payload){
        commit('setNotificationFlag',true);
        commit('setNotification',payload);
    },
    setNotificationFlag({commit,getters,rootState,rootGetters},payload){
        commit('setNotificationFlag',payload);
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}