import { handleDELETECallRecord, handlePOSTCallRecord } from '@/api'
import {Commit, Dispatch} from "vuex";
import {RootGetterInterface} from "@/store/myprofile";

interface CallRecordInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}
interface CallRecordStoreStateInterface {
  callRecords: CallRecordInterface[]
  callRecordsLoader: boolean
  newCallRecordLoaderFlag: boolean
  deleteCallRecordLoaderFlag: boolean
}

const state: CallRecordStoreStateInterface = {
  callRecords: [],
  callRecordsLoader: false,

  newCallRecordLoaderFlag: false,
  deleteCallRecordLoaderFlag: false

}

const getters = {
  getCallRecords (state: CallRecordStoreStateInterface) {
    return state.callRecords
  },
  getCallRecordsLoader (state: CallRecordStoreStateInterface) {
    return state.callRecordsLoader
  },
  getNewCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    return state.newCallRecordLoaderFlag
  },
  getDeleteCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    return state.deleteCallRecordLoaderFlag
  }

}
const mutations = {
  setCallRecords (state: CallRecordStoreStateInterface, payload: CallRecordInterface[]) {
    state.callRecords = payload
  },
  setNewCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    state.newCallRecordLoaderFlag = true
  },
  unsetNewCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    state.newCallRecordLoaderFlag = false
  },
  setDeleteCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    state.deleteCallRecordLoaderFlag = true
  },
  unsetDeleteCallRecordLoaderFlag (state: CallRecordStoreStateInterface) {
    state.deleteCallRecordLoaderFlag = false
  }
}
const actions = {
  async deleteCallRecord ({ commit, dispatch, state }: {commit: Commit, dispatch: Dispatch, state: CallRecordStoreStateInterface}, payload: {donorId: string, callRecordId: string}) {
    commit('setDeleteCallRecordLoaderFlag')
    const response = await handleDELETECallRecord(payload)
    commit('unsetDeleteCallRecordLoaderFlag')
    if (response.status !== 200) return
    let callRecords = state.callRecords
    callRecords = callRecords.filter((callRecord: CallRecordInterface) => {
      return callRecord._id !== payload.callRecordId
    })
    commit('setCallRecords', callRecords)
    dispatch('notification/notifySuccess', 'Successfully deleted call record', { root: true })
  },
  async postCallRecord ({ commit, dispatch, state, rootGetters } : {rootGetters: RootGetterInterface , commit: Commit, dispatch: Dispatch, state: CallRecordStoreStateInterface}, payload: {donorId: string}) {
    commit('setNewCallRecordLoaderFlag')
    const response = await handlePOSTCallRecord(payload)
    commit('unsetNewCallRecordLoaderFlag')
    if (response.status !== 200) return
    const callRecords = state.callRecords
    const name = rootGetters.getName
    callRecords.unshift({
      ...response.data.callRecord,
      callerId: { name, hall: rootGetters.getHall, designation: rootGetters.getDesignation }
    })
    commit('setCallRecords', callRecords)
    dispatch('notification/notifySuccess', 'Added call record', { root: true })
  },
  async postCallRecordFromCard ({ dispatch }: {dispatch: Dispatch}, payload: {donorId: string}) {
    await handlePOSTCallRecord(payload)
    dispatch('notification/notifySuccess', 'Added call record', { root: true })
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
