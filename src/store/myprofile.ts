interface MyProfileStateInterface {
  _id: string | null
  name: string | null
  studentId: string | null
  lastDonation: number | null
  bloodGroup: number | null
  hall: number | null
  phone: number | null
  address: string | null
  comment: string | null
  designation: number | null
  roomNumber: string | null
}

const state: MyProfileStateInterface = {
  _id: null,
  name: null,
  studentId: null,
  lastDonation: null,
  bloodGroup: null,
  hall: null,
  phone: null,
  address: null,
  comment: null,
  designation: null,
  roomNumber: null
}

export interface RootGetterInterface {
  getDesignation: number
  getPhone: number
  getHall: number
  getName: string
  getID: string
}

const getters = {
  getDesignation: (state: MyProfileStateInterface) => {
    return state.designation
  },
  getPhone: (state: MyProfileStateInterface) => {
    return state.phone
  },
  getHall: (state: MyProfileStateInterface) => {
    return state.hall
  },
  getName: (state: MyProfileStateInterface) => {
    return state.name
  },
  getID: (state: MyProfileStateInterface) => {
    return state._id
  },
}
const mutations = {
  setLastDonation (state: MyProfileStateInterface, lastDonation: number) {
    state.lastDonation = lastDonation
  },
  setComment (state: MyProfileStateInterface, comment: string) {
    state.comment = comment
  },

  setPhone (state: MyProfileStateInterface, phone: number) {
    state.phone = phone
  },

  setMyProfile (state: MyProfileStateInterface, payload: MyProfileStateInterface) {
    state._id = payload._id
    state.name = payload.name
    state.studentId = payload.studentId
    state.lastDonation = payload.lastDonation
    state.bloodGroup = payload.bloodGroup
    state.hall = payload.hall
    state.phone = payload.phone
    state.address = payload.address
    state.comment = payload.comment
    state.designation = payload.designation
    state.roomNumber = payload.roomNumber
  }

}
const actions = {}

export default {
  state,
  actions,
  getters,
  mutations
}
