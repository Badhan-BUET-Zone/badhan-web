import { handlePATCHDonorsComment } from '@/api'
import {Commit, Dispatch} from "vuex";
interface CommentStoreStateInterface {
  comment: string | null
  commentLoaderFlag: boolean
  commentSuccess: string | null
  commentError: string | null
}
const state: CommentStoreStateInterface = {
  comment: null,
  commentLoaderFlag: false,
  commentSuccess: null,
  commentError: null
}

const getters = {
  getCommentLoaderFlag (state: CommentStoreStateInterface) {
    return state.commentLoaderFlag
  }
}
const mutations = {
  commentLoaderFlagOn (state: CommentStoreStateInterface) {
    state.commentLoaderFlag = true
  },
  commentLoaderFlagOff (state: CommentStoreStateInterface) {
    state.commentLoaderFlag = false
  },
  setComment (state: CommentStoreStateInterface, payload: string) {
    state.comment = payload
  }

}
const actions = {
  async saveComment ({ commit, dispatch }: {commit: Commit, dispatch: Dispatch}, payload: {donorId: string, comment: string}) {
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
