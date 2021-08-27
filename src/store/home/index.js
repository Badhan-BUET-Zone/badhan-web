import {badhanAxios, handleGETSearchOptimized} from '../../api';
import {bloodGroups, halls} from "@/mixins/constants";
import donate from "@/store/home/donate";

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
    searchedHall: 0,

    persons: [],
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
    getPersons: state => {
        return state.persons;
    },
    getSearchedHall: state => {
        return state.searchedHall;
    }


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
    resetSearchResults(state) {
        state.personGroups = {};
        state.persons = [];
        state.searchResultShown = false;
    },

    setPersonGroups(state, payload) {
        state.personGroups = [];
        state.numOfDonor = payload.length;

        let persons = payload;

        state.persons = payload;

        let groupedPersons = persons.reduce(function (obj, person) {
            let batch = person.studentId.substr(0, 2);
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

    setSearchedHall(state, payload) {
        state.searchedHall = payload;
    },

    deletePerson(state, person) {
        let batch = person.studentId.substr(0, 2);
        for (let j = 0; j < state.personGroups.length; j++) {
            if (state.personGroups[j].batch === batch) {
                for (let i = 0; i < state.personGroups[j].people.length; i++) {
                    if (state.personGroups[j].people[i]._id === person._id) {
                        state.personGroups[j].people.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }
};
const actions = {
    async search({getters, commit}, payload) {

        //clear previous search results
        commit('hideSearchResults');
        commit('searchLoaderFlagOn');

        let sendData = {
            name: payload.inputName,
            bloodGroup: bloodGroups.indexOf(payload.bloodGroup),
            batch: payload.inputBatch.toString(),
            hall: halls.indexOf(payload.hall),
            isAvailable: payload.availability,
            isNotAvailable: payload.notAvailability,
            address: payload.inputAddress,
            availableToAll: payload.availableToAll
        };

        commit('searchLoaderFlagOn');
        let response = await handleGETSearchOptimized(sendData);
        commit('searchLoaderFlagOff');
        if (response.status !== 200) {
            return false;
        }
        commit('setPersonGroups', response.data.filteredDonors);
        commit('setSearchedHall', payload.hall);
        commit('hideFilter');
    },
};


export default {
    state,
    actions,
    getters,
    mutations,
    modules: {
        donate
    }
}
