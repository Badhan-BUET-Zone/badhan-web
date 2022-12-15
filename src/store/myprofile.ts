// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const state = {
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

const getters = {
  getRoomNumber: state => {
    return state.roomNumber
  },
  getDesignation: state => {
    return state.designation
  },
  getPhone: state => {
    return state.phone
  },
  getHall: state => {
    return state.hall
  },
  getName: state => {
    return state.name
  },
  getStudentId: state => {
    return state.studentId
  },
  getLastDonation: state => {
    return state.lastDonation
  },
  getBloodGroup: state => {
    return state.bloodGroup
  },
  getAddress: state => {
    return state.address
  },
  getComment: state => {
    return state.comment
  },
  getID: state => {
    return state._id
  },
  getMyProfile: state => {
    return {
      name: state.name,
      studentId: state.studentId,
      lastDonation: state.lastDonation,
      bloodGroup: state.bloodGroup,
      hall: state.hall,
      phone: state.phone,
      address: state.address,
      comment: state.comment,
      designation: state.designation,
      roomNumber: state.roomNumber,
      _id: state._id
    }
  }
}
const mutations = {
  setID (state, id) {
    state._id = id
  },
  setName (state, name) {
    state.name = name
  },
  setStudentId (state, studentId) {
    state.studentId = studentId
  },
  setLastDonation (state, lastDonation) {
    state.lastDonation = lastDonation
  },
  setBloodGroup (state, bloodGroup) {
    state.bloodGroup = bloodGroup
  },
  setAddress (state, address) {
    state.address = address
  },
  setComment (state, comment) {
    state.comment = comment
  },
  setDesignation (state, designation) {
    state.designation = designation
  },
  setPhone (state, phone) {
    state.phone = phone
  },
  setHall (state, hall) {
    state.hall = hall
  },
  setRoomNumber (state, roomNumber) {
    state.roomNumber = roomNumber
  },

  setMyProfile (state, payload) {
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
