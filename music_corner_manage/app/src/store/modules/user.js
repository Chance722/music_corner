const state = {
  userInfo: null
}

const mutations = {
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  state,
  mutations
}