import {badhanAxios} from '@/api';
import { bloodGroups, halls } from "@/constants";

let compareObject = (a, b) => {
    if (a.batch < b.batch) {
        return 1;
    } else {
        return -1;
    }
    return 0;
}

const state = {
    //SEARCH DONORS
    searchLoaderFlag: false,
    searchError: "",
    filterShownFlag: true,
    searchResultShown: false,
    personGroups: {},
    numOfDonor: 0,


};

const getters = {
    //SEARCH RESULTS
    getSearchResults: state => {
        return state.personGroups;
    },
    getNumberOfSearchResult: state => {
        return state.numOfDonor;
    },
    isFilterShown: state => {
        return state.filterShownFlag;
    },
    isSearchResultShown: state => {
        return state.searchResultShown;
    },
    isSearchLoading: state => {
        return state.searchLoaderFlag;
    },
    getSearchError: state => {
        return state.searchError;
    },
    getPersonGroups: state => {
        return state.personGroups;
    },
    getNumberOfDonors: state => {
        return state.numOfDonor;
    },


};
const mutations = {

    //SEARCH RESULTS
    searchLoaderFlagOn(state) {
        state.searchLoaderFlag = true;
    },
    searchLoaderFlagOff(state) {
        state.searchLoaderFlag = false;
    },
    setSearchError(state, payload) {
        state.searchError = payload;
    },
    clearSearchError(state) {
        state.searchError = "";
    },
    showFilter(state) {
        state.filterShownFlag = true;
    },
    hideFilter(state) {
        state.filterShownFlag = false;
    },
    toggleFilter(state) {
        state.filterShownFlag = !state.filterShownFlag;
    },
    showSearchResults(state) {
        state.searchResultShown = true;
    },
    hideSearchResults(state) {
        state.searchResultShown = false;
    },
    setPersonGroups(state, payload) {
        state.numOfDonor = payload.length;

        payload.forEach((human, index) => {
            human.availableIn = 120 - Math.round((Math.round((new Date()).getTime()) - human.lastDonation) / (1000 * 3600 * 24));
            //REDUNTANT PROPERTY USED!! NEED TO OPTIMIZE IN FUTURE
            human.studentID = Number(human.studentId);
        });
        let persons = payload;
        //persons.sort(this.compare);
        let groupedPersons = persons.reduce(function (obj, person) {
            let batch = person.studentID.toString().substr(0, 2);
            if (!obj.hasOwnProperty(batch)) {
                obj[batch] = [];
            }
            obj[batch].push(person);
            return obj;
        }, {});

        let sortedBatches = [];

        Object.keys(groupedPersons).forEach(function (key) {
            sortedBatches.push({
                batch: key,
                people: groupedPersons[key]
            });
        });
        sortedBatches.sort(compareObject);

        state.personGroups = sortedBatches;


        state.searchResultShown = true;
    },



};
const actions = {
    async search({ getters, commit }, payload) {
        console.log("INSIDE SEARCH ACTION")

        //clear previous search results
        commit('hideSearchResults');
        commit('searchLoaderFlagOn');

        let sendData = {
            name: payload.inputName,
            bloodGroup: bloodGroups.indexOf(payload.bloodGroup),
            batch: payload.inputBatch.toString(),
            hall: halls.indexOf(payload.hall),
            isAvailable: payload.availability,
            address: payload.inputAddress
        };
        let headers = {
            'x-auth': getters.getToken
        };
        console.log('REQUEST POST TO /donor/search: ', sendData);
        try {
            let response = await badhanAxios.post('/donor/search', sendData, { headers: headers });
            console.log("RESPONSE FROM /donor/search: ", response);

            if (response.status !== 200) {
                commit('setSearchError', "Status code not 200");
                return;
            }

            commit('setPersonGroups', response.data.filteredDonors);

            commit('hideFilter');

        } catch (error) {
            if(error.response.status===500){
                commit('setSearchError',error);
            }else{
                commit('setSearchError', error.response.data.message);
            }
        } finally {
            commit('searchLoaderFlagOff');
        }
    },


};


export default {
    state,
    actions,
    getters,
    mutations,
}