import { handlePATCHDonorsComment } from '../api'

const state = {
  comment: null,
  commentLoaderFlag: false,
  commentSuccess: null,
  commentError: null
}

const getters = {
  getComment (state) {
    return state.comment
  },
  getCommentLoaderFlag (state) {
    return state.commentLoaderFlag
  }
}
const mutations = {
  commentLoaderFlagOn (state) {
    state.commentLoaderFlag = true
  },
  commentLoaderFlagOff (state) {
    state.commentLoaderFlag = false
  },
  setComment (state, payload) {
    state.comment = payload
  }

}
const actions = {
  async saveComment ({ commit, getters, rootState, rootGetters, dispatch }, payload) {
    commit('commentLoaderFlagOn')
    const response = await handlePATCHDonorsComment(payload)
    commit('commentLoaderFlagOff')
    if (response.status !== 200) return
    dispatch('notification/notifySuccess', 'Successfully changed comment', { root: true })
  }
}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true

}
