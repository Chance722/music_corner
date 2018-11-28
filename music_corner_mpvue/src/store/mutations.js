const mutations = {
  setUserInfo (state, payload) {
    state.userInfo = payload.userInfo
  },
  setInnerAudioContext (state, innerAudioContext) {
    state.innerAudioContext = innerAudioContext
  },
  setCurrentSongInfo (state, payload) {
    state.currentSongInfo = payload.currentSongInfo
  }
}

export default mutations
