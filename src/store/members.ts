import { handleGETDonorsDesignation } from '@/api'
import ldb from '../localDatabase'
import {Commit} from "vuex";

interface HallAdminInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}
interface VolunteerInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}

interface SuperAdminInterface {
  _id: string // INCOMPLETE INTERFACE. Please complete this interface and enable stronger type checking
}

interface MemberStoreStateInterface {
  hallAdmins: HallAdminInterface[]
  volunteers: VolunteerInterface[]
  superAdmins: SuperAdminInterface[]
  memberLoaderFlag: boolean
}

const state: MemberStoreStateInterface = {
  hallAdmins: [],
  volunteers: [],
  superAdmins: [],
  memberLoaderFlag: false
}

const getters = {
  getHallAdmins (state: MemberStoreStateInterface) {
    return state.hallAdmins
  },
  getVolunteers (state: MemberStoreStateInterface) {
    return state.volunteers
  },
  getSuperAdmins (state: MemberStoreStateInterface) {
    return state.superAdmins
  },
  getMemberLoaderFlag (state: MemberStoreStateInterface) {
    return state.memberLoaderFlag
  }
}
const mutations = {
  assignMembers (state: MemberStoreStateInterface, payload: {adminList: HallAdminInterface[], superAdminList: SuperAdminInterface[], volunteerList: VolunteerInterface[]}) {
    state.hallAdmins = payload.adminList
    state.superAdmins = payload.superAdminList
    state.volunteers = payload.volunteerList
  },
  memberLoaderFlagOn (state: MemberStoreStateInterface) {
    state.memberLoaderFlag = true
  },
  memberLoaderFlagOff (state: MemberStoreStateInterface) {
    state.memberLoaderFlag = false
  }
}
const actions = {
  async fetchMembers ({ commit }: {commit: Commit}) {
    const cachedMemberResult = ldb.members.load()
    if (cachedMemberResult.status === 'OK') {
      commit('assignMembers', cachedMemberResult.data)
      return
    } else if (cachedMemberResult.status === 'ERROR') {
      commit('memberLoaderFlagOn')
    } else if (cachedMemberResult.status === 'EXPIRED') {
      commit('assignMembers', cachedMemberResult.data)
    }
    const response = await handleGETDonorsDesignation()
    commit('memberLoaderFlagOff')
    if (response.status !== 200) return
    commit('assignMembers', response.data)
    ldb.members.save(response.data)
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
