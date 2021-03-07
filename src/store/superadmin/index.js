import {badhanAxios} from '@/api';
const state = {
    hallAdmins: null,
    hallAdminsLoaderFlag: false,
    hallAdminsFetchError: null,

    changeAdminLoaderFlag: false,
    changeAdminError: null,
    changeAdminSuccess: null,
};

const getters = {
    getHallAdmins: state => {
        return state.hallAdmins;
    },
    getHallAdminsLoaderFlag: state=>{
        return state.hallAdminsLoaderFlag;
    },
    getHallAdminsFetchError: state=>{
        return state.hallAdminsFetchError;
    },

    getChangeAdminLoaderFlag: state=>{
        return state.changeAdminLoaderFlag;
    },
    getChangeAdminError: state=>{
        return state.changeAdminError;
    },
    getChangeAdminSuccess: state=>{
        return state.changeAdminSuccess;
    }
};
const mutations = {
    setHallAdmins(state, payload) {
        state.hallAdmins = payload;
    },
    setHallAdminsFetchError(state,payload){
        state.hallAdminsFetchError = payload;
    },
    clearHallAdminsFetchError(state){
        state.hallAdminsFetchError = null;
    },
    hallAdminsLoaderFlagOn(state){
        state.hallAdminsLoaderFlag = true;
    },
    hallAdminsLoaderFlagOff(state){
        state.hallAdminsLoaderFlag = false;
    },

    setChangeAdminError(state,payload){
        state.changeAdminError = payload;
    },
    clearChangeAdminError(state){
        state.changeAdminError = null;
    },
    changeAdminLoaderFlagOn(state){
        state.changeAdminLoaderFlag = true;
    },
    changeAdminLoaderFlagOff(state){
        state.changeAdminLoaderFlag = false;
    },
    setChangeAdminSuccess(state,payload){
        state.changeAdminSuccess = payload;
    },
    clearChangeAdminSuccess(state){
        state.changeAdminSuccess = null;
    }

};
const actions = {
    async fetchHallAdmins({ commit, getters }) {
        commit('clearHallAdminsFetchError');
        commit('hallAdminsLoaderFlagOn');
        let sendData = {};


        try {
            let response = await badhanAxios.post('/admin/hall/show', sendData);

            if (response.status !== 200) {
                commit('setHallAdminsFetchError',"Status code not 200")
                return;
            }
            
            commit('setHallAdmins',response.data.filteredAdmins)

        } catch (error) {
            console.log(error);
            // commit('setHallAdminsFetchError',error.response.data.message);
            console.log(error.response);
        } finally {
            commit('hallAdminsLoaderFlagOff');
        }
    },

    async changeHallAdmin({commit,getters,dispatch},payload){
            commit('clearHallAdminsFetchError');
            commit('changeAdminLoaderFlagOn');
            commit('clearChangeAdminSuccess');

            if (isNaN(payload.newAdminPhone) || payload.newAdminPhone.toString().length !== 11) {
                commit('setChangeAdminError',"Please enter a valid phone number");
                return;
            }

            let sendData = {
                userPhone: getters.getPhone,
                donorPhone: parseInt('88' + payload.newAdminPhone)
            };

            try {
                let response = await badhanAxios.post('/admin/hall/change', sendData);
                if (response.status !== 200) {
                    commit('setChangeAdminError',"Status code not 200");
                    return;
                }

                commit('setChangeAdminSuccess',"Successfully changed hall admin");

                dispatch('fetchHallAdmins');

            } catch (error) {
                commit('setChangeAdminError',error.response.data.message);
                console.log(error.response);
            } finally {
                commit('changeAdminLoaderFlagOff');
            }
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}