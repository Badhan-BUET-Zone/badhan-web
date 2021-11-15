import comment from '../userDetails/comment'
import userDetails from '../userDetails/userDetails'
import donation from '../userDetails/donation'
import callrecord from '../userDetails/callrecord'

export default {
  actions: {
    resetAllMessages ({ commit, getters }) {

    }
  },

  modules: {
    comment,
    userDetails,
    donation,
    callrecord
  }
}
