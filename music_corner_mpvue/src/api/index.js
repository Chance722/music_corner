// 本地开发接口地址
const baseUrl = 'http://localhost:3000'
const userId = wx.getStorageSync('userId')

export default {
  /**
   * 后台登录接口 记录用户信息 返回用户信息
   * @param {string} code
   * @param {object} userData
   * @param {sting} iv
   */
  login (code, userData, iv) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + '/api/user/login',
        data: {
          code: code,
          userData: userData,
          iv: iv
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: result => {
          resolve(result)
        }
      })
    })
  },
  /**
   * 首页获取推荐列表
   * @param {number} pageIndex
   * @param {number} pageSize
   */
  listRecommendSongs (pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + '/api/song/listRecommendSongs',
        data: {
          pageSize: pageSize,
          pageNum: pageIndex
        },
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success: result => {
          resolve(result)
        }
      })
    })
  },
  /**
   * 通过歌曲id获取歌曲信息
   * @param {number} songId
   */
  getSongById (songId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + `/api/song/getPassSong?id=${songId}`,
        header: {
          'content-type': 'application/json',
          'userId': userId
        },
        success: result => {
          resolve(result)
        }
      })
    })
  },
  /**
   * 用户操作歌曲动作接口 type PRAISE  : 1, COLLECT : 2, SHARE   : 3
   * @param {object} params
   */
  doOperation (params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + `/api/user/doOperation`,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        data: {
          userId: params.userId,
          songId: params.songId,
          type: params.type
        },
        success: result => {
          resolve(result)
        }
      })
    })
  }
}
