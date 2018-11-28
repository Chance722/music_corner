
const passSongModel = require('../models/pass_songs')
/**
 * 通用服务
 */
class CommonService {
  /**
 * 更新接口歌曲权重方法
 * @param {number} songId 
 */
  static async updateSongsWeight(songId) {
    let song = await passSongModel.find({
      where: {
        id: songId
      }
    })
    if (song) {
      // 推荐列表 各个相关字段所占的权重比例
      let collect_weight = 0.4
      let listen_weight = 0.3
      let praise_weight = 0.1
      let comment_weight = 0.1
      let search_weight = 0.1
      let weight_value = song.collect_num * collect_weight + listen_num * listen_weight +
        praise_num * praise_weight + comment_num * comment_weight + search_weight * search_num
      try {
        passSongModel.update({
          weight: weight_value
        }, {
            where: {
              id: songId
            }
          })
      } catch (e) {
        console.log(e)
      }

    }
  }
}

module.exports = CommonService