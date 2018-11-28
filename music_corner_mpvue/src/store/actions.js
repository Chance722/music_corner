const actions = {
  setUserInfo ({ commit }, payload) {
    commit({
      type: 'setUserInfo',
      userInfo: payload.userInfo
    })
  },
  setCurrentSongInfo ({ commit }, currentSongInfo) {
    commit({
      type: 'setCurrentSongInfo',
      currentSongInfo: currentSongInfo
    })
  }
}

export default actions
