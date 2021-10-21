import {handleGETFrontendSettings} from "../api";
import ldb from "../localDatabase";
const state = {
    settings:{
        "version": "4.5.1",
        "backendBaseURL": "https://badhan-web.herokuapp.com",
        "backendTestBaseURL": "https://badhan-web-test.herokuapp.com",
        "defaultExists":true,
    }
};

const getters = {
    getSettings(state){
        if(state.settings.defaultExists){
            let cachedSettings = ldb.frontendSettings.load();
            if(cachedSettings.status!=="ERROR") {
                state.settings = cachedSettings.data;
            }
        }
        return state.settings;

    },
};
const mutations = {
    setSettings(state, settings){
        state.settings = settings;
        ldb.frontendSettings.save(settings);
    },
};
const actions = {
    async fetchSettings({commit, dispatch, getters}) {
        let response = await handleGETFrontendSettings();
        if(response.status!==200)return;
        console.log(response.data);
        commit('setSettings',response.data);

    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
