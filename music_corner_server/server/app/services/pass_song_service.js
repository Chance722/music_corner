const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const dataUtils = require('../helper/dataUtils')
const sequelize = require('../models/sequelize')
const Page = require('../helper/page')
const passSongModel = require('../models/pass_songs')
const userModel = require('../models/user')
const songsTagModel = require('../models/songs_tag')
const songCollectModel = require('../models/songs_collect')
const songPrsiseModel = require('../models/songs_praise')

// 表关联只定义一次
passSongModel.belongsTo(userModel, {
  as: 'shareUser',
  foreignKey: 'share_id'
})

class PassSongService {

  static async listRecommendSongs (ctx) {
    let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum

		let totalSongNum = await passSongModel.count()

		let page = new Page()
		page.setPageSize(parseInt(pageSize))
		page.setPageNum(parseInt(pageNum))
		page.setTotalRecord(parseInt(totalSongNum))
		let startIndex = page.getStartRecord()
		let num = page.getPageNum()
		let size = page.getPageSize()
    let totalRecord = page.getTotalRecord()
    
    console.log(sequelize.col('collect_num'))

		let list = await passSongModel.findAll({
			offset: startIndex,
			limit: size,
			order: [
        ['weight', 'DESC'],
        ['share_time', 'DESC']
      ]
		}).then().catch(err => {
			console.log(err)
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		})

		ctx.body = {
			data: {
				pageNum: num,
				pageSize: size,
				totalRecord: totalRecord,
				list: list
			}
		}
  }

  static async getSong(ctx) {
    if (!ctx.query.id) {
      throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
    }
    if (!ctx.header.userid) {
      throw new ApiError(ApiErrorNames.ADMIN.TOKEN_ERROR)
    }
    try {
      let song = await passSongModel.find({
        where: {
          id: ctx.query.id
        },
        include: {
          as: 'shareUser',
          model: userModel
        }
      })
      let collect = await songCollectModel.find({
        where: {
          songId: ctx.query.id,
          userId: ctx.header.userid,
          isCollect: 1
        }
      })
      let praise = await songPrsiseModel.find({
        where: {
          songId: ctx.query.id,
          userId: ctx.header.userid,
          isPraise: 1
        }
      })

      let isCollect = collect ? 1 : 0
      let isPraise = praise ? 1 : 0
      song['dataValues']['is_collect'] = isCollect
      song['dataValues']['is_praise'] = isPraise

      ctx.body = {
        data: song
      }
    } catch(e) {
      throw new ApiError(ApiErrorNames.DATABASE_ERROR)
    }
  }

}

module.exports = PassSongService

