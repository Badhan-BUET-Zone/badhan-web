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
            console.log("REQUEST TO /users/signout: BLANK");
            let response = await badhanAxios.post('/users/signout', {}, { headers: { 'x-auth': getters.getToken } });
            console.log("RESPONSE FROM /users/signout: ", response);
            
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
            console.log("REQUEST POST TO /users/signin: HIDDEN");
            let response = await badhanAxios.post('/users/signin', sendData);

            console.log("RESPONSE FROM /users/signin: ", response);

            if (response.status !== 201) {
                commit('setSignInError', "Status code not 201")
                return;
            }

            commit('setToken', response.data.token);

            let headers = {
                'x-auth': getters.getToken
            };
            sendData = {
                donorPhone: parseInt('88' + payload.phone)
            };

            console.log("REQUEST POST TO /donor/details: ", sendData);
            let profileInfo = await badhanAxios.post('/donor/details', sendData, { headers: headers });

            console.log("RESPONSE FROM /donor/details: ", profileInfo);

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
