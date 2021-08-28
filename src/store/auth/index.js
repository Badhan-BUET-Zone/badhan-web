import {
    resetBaseURL,
    enableGuestAPI,
    handleDELETESignOut,
    handleDELETESignOutAll,
    handlePOSTRedirection,
    handlePATCHRedirectedAuthentication,
    handleGETDonorsMe,
    handlePOSTSignIn
} from '../../api';

const state = {
    token: null,
    signInLoaderFlag: false,
    error: "",

    redirectionRequestMade: false,
    isLoggedIn: false,
    isGuest: false,

    autoRedirectionPath: null,
};

const getters = {

    getToken: state => {
        return state.token
    },
    getError: state => {
        return state.error
    },
    getSignInLoaderFlag: state => {
        return state.signInLoaderFlag
    },
    getRedirectionRequestMade: state => {
        return state.redirectionRequestMade
    },
    getIsLoggedIn: state => {
        return state.isLoggedIn;
    },
    getIsGuest: state => {
        return state.isGuest;
    },

    getAutoRedirectionPath: state => {
        return state.autoRedirectionPath;
    },

};
const mutations = {
    setAutoRedirectionPath(state, path) {
        state.autoRedirectionPath = path;
    },
    unsetAutoRedirectionPath(state) {
        state.autoRedirectionPath = null;
    },

    loadTokenFromLocalStorage(state) {
        state.token = localStorage.getItem('x-auth');
    },

    saveTokenToLocalStorage(state) {
        localStorage.setItem('x-auth', state.token);
    },

    removeTokenFromLocalStorage(state) {
        localStorage.removeItem('x-auth');
    },


    setToken(state, token) {
        state.token = token;
        localStorage.setItem('x-auth', state.token);
    },

    removeToken(state) {
        state.token = null;
        localStorage.removeItem('x-auth');
    },

    signInLoaderFlagOn(state) {
        state.signInLoaderFlag = true;
    },

    signInLoaderFlagOff(state) {
        state.signInLoaderFlag = false;
    },

    setSignInError(state, payload) {
        state.error = payload;
    },
    clearSignInError(state) {
        state.error = "";
    },

    setLoginFlag(state) {
        state.isLoggedIn = true;
    },
    unsetLoginFlag(state) {
        state.isLoggedIn = false;
    },


};
const actions = {
    async logout({commit, dispatch}) {
        commit('setLoadingTrue');
        let data = await handleDELETESignOut();
        if (data) {
            dispatch('notification/notifySuccess', data.message);
        }
        commit('setLoadingFalse');
        commit('unsetLoginFlag')
        commit('removeToken');
        commit('removeTokenFromLocalStorage');
        resetBaseURL()
    },
    async logoutAll({commit, dispatch}) {
        commit('setLoadingTrue');
        let data = await handleDELETESignOutAll();
        if (data) {
            dispatch('notification/notifySuccess', data.message);
        }

        commit('setLoadingFalse');
        commit('unsetLoginFlag');
        commit('removeToken');
        commit('removeTokenFromLocalStorage');
        resetBaseURL()

    },
    async requestRedirectionToken({commit}) {
        commit('setLoadingTrue');
        let token = await handlePOSTRedirection();
        commit('setLoadingFalse');
        if (!token) return null;
        return token;
    },
    async redirectionLogin({getters, commit, dispatch}, payload) {
        commit('signInLoaderFlagOn');
        let token = await handlePATCHRedirectedAuthentication({token: payload});

        if (!token) {
            commit('signInLoaderFlagOff');
            return false;
        }

        commit('setToken', token);
        let response = await handleGETDonorsMe();
        commit('signInLoaderFlagOff');

        if (response.status!==200) return false;

        let donor = response.data.donor;
        commit('setMyProfile', donor);
        commit('setLoginFlag');
        commit('saveTokenToLocalStorage');
        return true;

    },
    async autoLogin({getters, commit, dispatch}) {
        commit('loadTokenFromLocalStorage');
        if (getters.getToken === null) return true;

        commit('signInLoaderFlagOn');
        let response = await handleGETDonorsMe();
        commit('signInLoaderFlagOff');

        if (response.status!==200) {
            if(response.status!==401)return false;
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            return false;
        }

        let donor = response.data.donor;
        commit('setMyProfile', donor);
        commit('setLoginFlag');
        return true;
    },

    async guestLogin({dispatch}) {
        enableGuestAPI();
        await dispatch('login', {phone: "123465", password: "oseihgfweoisng", rememberFlag: false})
    },

    async resetBaseURLOfAPI() {
        resetBaseURL()
    },

    async login({getters, commit, dispatch}, payload) {
        commit('signInLoaderFlagOn');
        let sendData = {
            phone: parseInt('88' + payload.phone),
            password: payload.password,
        };

        let data = await handlePOSTSignIn(sendData);

        if (!data) {
            commit('signInLoaderFlagOff');
            return false;
        }
        commit('setToken', data.token);

        let response = await handleGETDonorsMe();
        commit('signInLoaderFlagOff');

        if(response.status!==200){
            return false;
        }

        let donor =  response.data.donor;
        dispatch('notification/notifySuccess', data.message);
        commit('setMyProfile', donor);

        if (payload.rememberFlag) {
            commit('saveTokenToLocalStorage');
        } else {
            commit('removeTokenFromLocalStorage');
        }
        commit('setLoginFlag');
        return true;
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}
