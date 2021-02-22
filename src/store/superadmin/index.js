import axios from 'axios';
const state = {
    hallAdmins: null,
    hallAdminsLoaderFlag: false,
    hallAdminsFetchError: null,
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
    }
};
const actions = {
    async fetchHallAdmins({ commit, getters }) {
        commit('clearHallAdminsFetchError');
        commit('hallAdminsLoaderFlagOn');
        let sendData = {};
        let headers = {
            'x-auth': getters.getToken
        }
        console.log('REQUEST TO /admin/hall/show: ', sendData);

        try {
            let response = await axios.post('/admin/hall/show', sendData, { headers: headers });
            console.log('RESPONSE FROM /admin/hall/show: ', response);

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
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}