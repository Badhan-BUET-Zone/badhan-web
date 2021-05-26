import {badhanAxios,resetBaseURL,enableGuestAPI} from '../../api';
const state = {
    token: null,
    signInLoaderFlag: false,
    error: "",

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
    isLoggedIn: state => {
        return state.token !== null;
    }
};
const mutations = {
    autoLogin({getters, commit}) {

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

};
const actions = {
    async logout({getters, commit, dispatch}) {
        try {
            commit('setLoadingTrue');
            let response = await badhanAxios.post('/users/signout', {});
            dispatch('notification/notifySuccess', response.data.message);
        } catch (e) {
        } finally {
            commit('setLoadingFalse');
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            resetBaseURL()
        }
    },
    async logoutAll({getters, commit, dispatch}) {
        try {
            commit('setLoadingTrue');
            let response = await badhanAxios.post('/users/signoutall', {});
            dispatch('notification/notifySuccess', response.data.message);
        } catch (e) {

        } finally {
            commit('setLoadingFalse');
            commit('removeToken');
            commit('removeTokenFromLocalStorage');
            resetBaseURL()
        }
    },
    async autoLogin({getters, commit, dispatch}) {
        commit('loadTokenFromLocalStorage');
        if (getters.getToken === null)
            return true;
        console.log(getters.getToken);
        try {
            commit('signInLoaderFlagOn');
            let sendData = {};

            let profileInfo = await badhanAxios.post('v2/donor/details/self', sendData);

            // dispatch('notification/notifySuccess', "Successfully Logged In");
            commit('setMyProfile', profileInfo.data.donor);
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

            sendData = {};

            let profileInfo = await badhanAxios.post('v2/donor/details/self', sendData);

            dispatch('notification/notifySuccess', "Successfully Logged In");

            commit('setMyProfile', profileInfo.data.donor);

            if (payload.rememberFlag) {
                commit('saveTokenToLocalStorage');
                // commit('saveMyProfileToLocalStorage');
            } else {
                commit('removeTokenFromLocalStorage');
                // commit('removeProfileFromLocalStorage');
            }
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
