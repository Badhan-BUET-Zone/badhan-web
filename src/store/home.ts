/* eslint-disable */ 
// @ts-nocheck
/* eslint-disable */
import { handleGETSearchV3 } from '../api'
import { bloodGroups, halls } from '../mixins/constants'

const compareObject = (a, b) => {
  if (a.batch < b.batch) {
    return 1
  } else {
    return -1
  }
}

const state = {
  // SEARCH DONORS
  searchLoaderFlag: false,
  searchResultShown: false,
  personGroups: {},
  searchedHall: 0,

  persons: [],
  numOfDonor: 0

}

const getters = {
  isSearchResultShown: state => {
    return state.searchResultShown
  },
  isSearchLoading: state => {
    return state.searchLoaderFlag
  },
  getPersonGroups: state => {
    return state.personGroups
  },
  getNumberOfDonors: state => {
    return state.numOfDonor
  },
  getPersons: state => {
    return state.persons
  },
  getSearchedHall: state => {
    return state.searchedHall
  }
}
const mutations = {

  // SEARCH RESULTS
  searchLoaderFlagOn (state) {
    state.searchLoaderFlag = true
  },
  searchLoaderFlagOff (state) {
    state.searchLoaderFlag = false
  },
  hideSearchResults (state) {
    state.searchResultShown = false
  },
  resetSearchResults (state) {
    state.personGroups = {}
    state.persons = []
    state.searchResultShown = false
  },

  setPersonGroups (state, payload) {
    state.personGroups = []
    state.numOfDonor = payload.length

    const persons = payload

    state.persons = payload

    const groupedPersons = persons.reduce(function (obj, person) {
      const batch = person.studentId.substr(0, 2)
      if (!Object.prototype.hasOwnProperty.call(obj, batch)) {
        obj[batch] = []
      }
      obj[batch].push(person)
      return obj
    }, {})

    const sortedBatches = []

    Object.keys(groupedPersons).forEach(function (key) {
      sortedBatches.push({
        batch: key,
        people: groupedPersons[key]
      })
    })
    sortedBatches.sort(compareObject)
    state.personGroups = sortedBatches
    state.searchResultShown = true
  },

  setSearchedHall (state, payload) {
    state.searchedHall = payload
  },

  deletePerson (state, person) {
    const batch = person.studentId.substr(0, 2)
    for (let j = 0; j < state.personGroups.length; j++) {
      if (state.personGroups[j].batch === batch) {
        for (let i = 0; i < state.personGroups[j].people.length; i++) {
          if (state.personGroups[j].people[i]._id === person._id) {
            state.personGroups[j].people.splice(i, 1)
            return
          }
        }
      }
    }
  }
}
const actions = {
  async search ({ getters, commit }, payload) {
    // clear previous search results
    commit('hideSearchResults')
    commit('searchLoaderFlagOn')

    const sendData = {
      name: payload.inputName,
      bloodGroup: bloodGroups.indexOf(payload.bloodGroup),
      batch: payload.inputBatch.toString(),
      hall: halls.indexOf(payload.hall),
      isAvailable: payload.availability,
      isNotAvailable: payload.notAvailability,
      address: payload.inputAddress,
      availableToAll: payload.availableToAll
    }

    commit('searchLoaderFlagOn')
    const response = await handleGETSearchV3(sendData)
    commit('searchLoaderFlagOff')
    if (response.status !== 200) {
      return false
    }
    commit('setPersonGroups', response.data.filteredDonors)
    commit('setSearchedHall', payload.hall)
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
