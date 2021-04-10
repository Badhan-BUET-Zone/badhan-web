import {badhanAxios} from '@/api';

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
    autoLogin({ getters, commit }) {

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
    async logout({ getters, commit }) {
        try {
            commit('setLoadingTrue');
            let response = await badhanAxios.post('/users/signout', {});

        } catch (e) {
            console.log(e);
        } finally {
            commit('setLoadingFalse');
		commit('removeToken');
            commit('removeTokenFromLocalStorage');
            commit('removeProfileFromLocalStorage');
        }

    },
    autoLogin({ getters, commit }) {
        commit('loadTokenFromLocalStorage');

        if (getters.getToken === null) {
            return false;
        } else {
            commit('loadMyProfileFromLocalStorage');
            return true;
        }
    },
    async login({ getters, commit }, payload) {

        commit('signInLoaderFlagOn');
        try {
            let sendData = {
                phone: parseInt('88' + payload.phone),
                password: payload.password
            };
            let response = await badhanAxios.post('/users/signin', sendData);


            if (response.status !== 201) {
                commit('setSignInError', "Status code not 201")
                return;
            }

            commit('setToken', response.data.token);

            sendData = {

            };

            let profileInfo = await badhanAxios.post('v2/donor/details/self', sendData);

            commit('setMyProfile', profileInfo.data.donor);

            if (payload.rememberFlag) {
                commit('saveTokenToLocalStorage');
                commit('saveMyProfileToLocalStorage');
            } else {
                commit('removeTokenFromLocalStorage');
                commit('removeProfileFromLocalStorage');
            }

            return true;

        } catch (error) {
            console.log(error);
            commit('setSignInError', error.response.data.message);

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
