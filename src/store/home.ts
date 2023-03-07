import { handleGETSearchV3 } from '@/api'
import { bloodGroups, halls } from '@/mixins/constants'
import {Commit} from "vuex";

const compareObject = (a: PersonGroupsInterface, b: PersonGroupsInterface) => {
  if (a.batch < b.batch) {
    return 1
  } else {
    return -1
  }
}

export interface PersonInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
  studentId: string
  hall: number
  donationCount: number
  lastDonation: number
  bloodGroup: number
}
interface PersonGroupsInterface {
  batch: string
  people: PersonInterface[]
}

interface HomeStoreStateInterface {
  searchLoaderFlag: boolean
  searchResultShown: boolean
  searchedHall: number
  numOfDonor: number
  persons: PersonInterface[]
  personGroups: PersonGroupsInterface[]
}

const state: HomeStoreStateInterface = {
  // SEARCH DONORS
  searchLoaderFlag: false,
  searchResultShown: false,
  personGroups: [],
  searchedHall: 0,

  persons: [],
  numOfDonor: 0

}

const getters = {
  isSearchResultShown: (state: HomeStoreStateInterface) => {
    return state.searchResultShown
  },
  isSearchLoading: (state: HomeStoreStateInterface) => {
    return state.searchLoaderFlag
  },
  getPersonGroups: (state: HomeStoreStateInterface) => {
    return state.personGroups
  },
  getNumberOfDonors: (state: HomeStoreStateInterface) => {
    return state.numOfDonor
  },
  getPersons: (state: HomeStoreStateInterface) => {
    return state.persons
  },
  getSearchedHall: (state: HomeStoreStateInterface) => {
    return state.searchedHall
  }
}
const mutations = {

  // SEARCH RESULTS
  searchLoaderFlagOn (state: HomeStoreStateInterface) {
    state.searchLoaderFlag = true
  },
  searchLoaderFlagOff (state: HomeStoreStateInterface) {
    state.searchLoaderFlag = false
  },
  hideSearchResults (state: HomeStoreStateInterface) {
    state.searchResultShown = false
  },
  resetSearchResults (state: HomeStoreStateInterface) {
    state.personGroups = []
    state.persons = []
    state.searchResultShown = false
  },

  setPersonGroups (state: HomeStoreStateInterface, payload: PersonInterface[]) {
    state.personGroups = []
    state.numOfDonor = payload.length

    const persons = payload

    state.persons = payload

    const groupedPersons = persons.reduce(function (obj: { [key: string]: PersonInterface[] }, person: PersonInterface) {
      const batch = person.studentId.substr(0, 2)
      if (!Object.prototype.hasOwnProperty.call(obj, batch)) {
        obj[batch] = []
      }
      obj[batch].push(person)
      return obj
    }, {})

    const sortedBatches: {batch: string, people: PersonInterface[]}[] = []

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

  setSearchedHall (state: HomeStoreStateInterface, payload: number) {
    state.searchedHall = payload
  },

  deletePerson (state: HomeStoreStateInterface, person: PersonInterface) {
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
  async search ({ commit }: {commit: Commit}, payload:{
    inputName: string,
    bloodGroup: string,
    inputBatch: string,
    hall: string,
    availability: boolean,
    notAvailability: boolean,
    inputAddress: string,
    availableToAll: boolean
  }) {
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
      return
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
