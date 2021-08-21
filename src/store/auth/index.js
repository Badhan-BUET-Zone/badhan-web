import {badhanAxios,resetBaseURL,enableGuestAPI} from '../../api';
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
    getRedirectionRequestMade: state =>{
        return state.redirectionRequestMade
    },
    getIsLoggedIn: state =>{
        return state.isLoggedIn;
    },
    getIsGuest: state=>{
        return state.isGuest;
    },

    getAutoRedirectionPath: state=>{
        return state.autoRedirectionPath;
    },

};
const mutations = {
    setAutoRedirectionPath (state,path){
        state.autoRedirectionPath = path;
    },
    unsetAutoRedirectionPath(state){
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

    },

    removeToken(state) {
        state.token = null;
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

    setLoginFlag(state){
        state.isLoggedIn = true;
    },
    unsetLoginFlag(state){
        state.isLoggedIn = false;
    },



};
const actions = {
    async logout({getters, commit, dispatch}) {
        try {
            commit('setLoadingTrue');
            let response = await badhanAxios.delete('/users/signout', {});
            dispatch('notification/notifySuccess', response.data.message);
        } catch (e) {
        } finally {
            commit('setLoadingFalse');
            commit('unsetLoginFlag')
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            resetBaseURL()
        }
    },
    async logoutAll({commit, dispatch}) {
        try {
            commit('setLoadingTrue');
            let response = await badhanAxios.delete('/users/signout/all');
            dispatch('notification/notifySuccess', response.data.message);
        } catch (e) {

        } finally {
            commit('setLoadingFalse');
            commit('unsetLoginFlag');
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            resetBaseURL()
        }
    },
    async requestRedirectionToken({commit}){
        commit('setLoadingTrue');
        try{
            let response = await badhanAxios.post('/users/redirection');
            return response.data.token;
        }catch (e){
            return null;
        }finally {
            commit('setLoadingFalse');
        }
    },
    async redirectionLogin({getters,commit, dispatch},payload){
        try {
            commit('signInLoaderFlagOn');
            let sendData = {
                token: payload
            };

            let response = await badhanAxios.patch('/users/redirection', sendData);

            commit('setToken', response.data.token);


            let profileInfo = await badhanAxios.get('/donors/me');

            commit('setMyProfile', profileInfo.data.donor);
            commit('setLoginFlag');
            commit('saveTokenToLocalStorage');
            return true;
        } catch (error) {
            return false;
        } finally {
            commit('signInLoaderFlagOff');
        }
    },
    async autoLogin({getters, commit, dispatch}) {
        commit('loadTokenFromLocalStorage');
        if (getters.getToken === null)
            return true;
        try {
            commit('signInLoaderFlagOn');
            let sendData = {};

            let profileInfo = await badhanAxios.get('/donors/me');

            // dispatch('notification/notifySuccess', "Successfully Logged In");
            commit('setMyProfile', profileInfo.data.donor);
            commit('setLoginFlag');
            return true;
        } catch (error) {
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            return false;
        } finally {
            commit('signInLoaderFlagOff');
        }


    },

    async guestLogin({dispatch}){
        enableGuestAPI();
        await dispatch('login',{phone:"123465",password:"oseihgfweoisng",rememberFlag: false})
    },

    async resetBaseURLOfAPI(){
        resetBaseURL()
    },

    async login({getters, commit, dispatch}, payload) {
        commit('signInLoaderFlagOn');
        try {
            let sendData = {
                phone: parseInt('88' + payload.phone),
                password: payload.password,
            };
            let response = await badhanAxios.post('/users/signin', sendData);


            if (response.status !== 201) {
                dispatch('notification/notifyError', "Status code not 201")
                return;
            }

            commit('setToken', response.data.token);

            let profileInfo = await badhanAxios.get('donors/me');

            dispatch('notification/notifySuccess', response.data.message);

            commit('setMyProfile', profileInfo.data.donor);

            if (payload.rememberFlag) {
                commit('saveTokenToLocalStorage');
                // commit('saveMyProfileToLocalStorage');
            } else {
                commit('removeTokenFromLocalStorage');
                // commit('removeProfileFromLocalStorage');
            }
            commit('setLoginFlag');
            return true;
        } catch (error) {
            return false;
        } finally {
            commit('signInLoaderFlagOff');
        }
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}
