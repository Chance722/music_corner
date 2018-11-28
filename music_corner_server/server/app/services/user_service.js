const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const dataUtils = require('../helper/dataUtils')
const commonUtils = require('../helper/common')
const sequelize = require('../models/sequelize')
const userModel = require('../models/user')
const songModel = require('../models/songs')
const passSongModel = require('../models/pass_songs')
const songService = require('./song_service')
const commonService = require('./common_service')
const userAttentionModel = require('../models/users_attention')
const songCollectModel = require('../models/songs_collect')
const songPraiseModel = require('../models/songs_praise')
const crypto = require('crypto')
const request = require('request')
const DICTIONARY = require('../../dictionary')
const Page = require('../helper/page')
const appId = 'wx635ec2faed2bca3d'
const appSecret = '2104065a375a5b3f0b4df213e4a1f309'
const wxURL = 'https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$code&grant_type=authorization_code'

// 定义关联查询 外键(songId)在source model（即songCollectModel）上 所以用belongsTo(1:1)
// 如果外键在target model（即songModel）上 则用hasOne
songCollectModel.belongsTo(songModel, {
  as: 'songInfo',
  foreignKey: 'songId'
})


class UserService {

	static async login(ctx) {
		let code = ctx.request.body.code
		let userData = ctx.request.body.userData
		let iv = ctx.request.body.iv

		let option = {
			url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
		}

		let result = await commonUtils.doRequest(option)

		if(!result) throw new ApiError(ApiErrorNames.WX.LOGIN_ERROR)

		let decodeData = commonUtils.decryptData(userData, iv, JSON.parse(result).session_key, appId)

		try{

			let user = await this.addUser(decodeData)
			
			ctx.body = {
				data: {
					userid: user[0].id,
					openid: user[0].openId,
					nickname: user[0].nickname,
					avator: user[0].avator,
					sex: user[0].sex
				}
			}

		}catch (e) {
			throw e
		}
		
	}

	static async update(ctx) {
		let introduction = ctx.request.body.introduction
		let userId = ctx.request.body.userId
		if(dataUtils.isEmpty(introduction) || dataUtils.isEmpty(userId)) throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)

		try{
			await userModel.update({
			  introduction: introduction
			}, {
			  where: {
			    id: userId
			  }
			})

			ctx.body = {
				code: 0,
				message: '修改成功'
			}

		}catch(e) {
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}
	}

	static async attention(ctx) {
		let id = ctx.request.body.id
		let followId = ctx.request.body.followId

		if(dataUtils.isEmpty(id) || dataUtils.isEmpty(followId)) throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)

		let user1 = await userModel.findOne({
			where: {
				id: id
			}
		})

		let user2 = await userModel.findOne({
			where: {
				id: followId
			}
		})

		if(!user1 || !user2) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)

		if(id === followId) throw new ApiError(ApiErrorNames.USER.FOLLOW_SELF_ERROR)

		let attention = await userAttentionModel.findOne({
			where: {
				userId   : id,
				followId : followId
			}
		})

		if(attention) throw new ApiError(ApiErrorNames.USER.ATTENTION_AGAIN_ERROR)

		try{
			//判断被关注人是否已经关注你
			const isFollowEach = 0
			let attention2 = await userAttentionModel.findOne({
				where: {
					userId   : followId,
					followId : id
				}
			})

			if(attention2) {
				isFollowEach = 1
				await userAttentionModel.update({
					isFollowEach: isFollowEach
				},{
					where: {
						userId: followId
					}
				})
			}

			await userAttentionModel.create({
				userId: id,
				followId: followId,
				followTime: new Date().getTime(),
				isFollowEach: isFollowEach
			})

			ctx.body = {
				code: 0,
				message: '关注成功'
			}

		}catch(e){
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}


	}

	static async getUserByOpenId(openId) {
		//如果id为空 则抛出API异常
		if(!openId) {
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
		}

		let user = await userModel.find({
			where: {
				openId: openId
			}
		})

		if(user) {
			return user
		}else {
			return null
		}

	}

	static async addUser(userData) {
		if( dataUtils.isEmpty(userData.openId) || dataUtils.isEmpty(userData.nickName) ||
			dataUtils.isEmpty(userData.avatarUrl) ) {
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
		}

		try {
			//findOrCreate方法返回一个数组对象 arr[0]为找到或创建的对象数据 arr[1]true为创建 false为数据库已有记录
			let user = await userModel.findOrCreate({
				where: {
					openId: userData.openId
				},
				defaults: {
					nickname: userData.nickName,
					sex: userData.gender,
					city: userData.city,
					province: userData.province,
					country: userData.country,
					avator: userData.avatarUrl,
					openId: userData.openId,
					updateTime: new Date().getTime()
				}
			})

			return user

		} catch (err) {
			console.log(err)
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}

	}

	static async doOperation(ctx) {
		//console.log(DICTIONARY.SONG_OPERATION_TYPE.COLLECT)
		let userId = ctx.request.body.userId
		let songId = ctx.request.body.songId
		let type = ctx.request.body.type
		if(dataUtils.isEmpty(userId) || dataUtils.isEmpty(songId) || dataUtils.isEmpty(type)) throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)

		let user = await userModel.findOne({
			where: {
				id: userId
			}
		})
		if(!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)

    let song = await passSongModel.findOne({
			where: {
				id: songId
			}
		})
		if(!song) throw new ApiError(ApiErrorNames.SONG_NOT_EXIST)

		if(type === DICTIONARY.SONG_OPERATION_TYPE.COLLECT) {
			await this.doCollect(songId, userId)
		}else if(type === DICTIONARY.SONG_OPERATION_TYPE.PRAISE) {
			await this.doPraise(songId, userId)
		}else {
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
    }
    
    // 更新歌曲权重
    commonService.updateSongsWeight(songId)

		ctx.body = {
			code: 0,
			message: '操作成功'
		} 


	}


	static async doPraise(songId, userId) {

		let praise = await songPraiseModel.findOne({
			where: {
				songId: songId,
				userId: userId
			}
		})

		try{
			if(!praise) {
				await songPraiseModel.create({
					songId: songId,
					userId: userId,
					praiseTime: new Date().getTime(),
					isPraise: 1
				})
			}else {
				let isPraise = 0
				praise.isPraise == 1 ? isPraise = 0 : isPraise = 1
				await songPraiseModel.update({
					isPraise: isPraise
				},{
					where: {
						songId: songId,
						userId: userId
					}
				})
			}
		}catch(e) {
			console.log(e)
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}
	}


	static async doCollect(songId, userId) {

		let collect = await songCollectModel.findOne({
			where: {
				songId: songId,
				userId: userId
			}
		})

		try{
			if(!collect) {
				await songCollectModel.create({
					songId: songId,
					userId: userId,
					collectTime: new Date().getTime(),
					isCollect: 1
				})
			}else {
				let isCollect = 0
				collect.isCollect == 1 ? isCollect = 0 : isCollect = 1
				await songCollectModel.update({
					isCollect: isCollect
				},{
					where: {
						songId: songId,
						userId: userId
					}
				})
			}
		}catch(e) {
			console.log(e)
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}
	}

	static async listCollectSongs(ctx) {

		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum
		let userId = ctx.request.body.userId

		let totalSongNum = await songCollectModel.count({
			where: {
				userId: userId,
				isCollect: 1
			}
		})

		let page = new Page()
		page.setPageSize(parseInt(pageSize))
		page.setPageNum(parseInt(pageNum))
		page.setTotalRecord(parseInt(totalSongNum))
		let startIndex = page.getStartRecord()
		let num = page.getPageNum()
		let size = page.getPageSize()
    let totalRecord = page.getTotalRecord()
    	
		let list = await songCollectModel.findAll({
			offset: startIndex,
			limit: size,
			where: {
				userId: userId,
        isCollect: 1
      },
      include: {
        as: 'songInfo',
        model: songModel
      }
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


	static async listShareSongs(ctx) {

		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum
		let userId = ctx.request.body.userId

		let totalSongNum = await songModel.count({
			where: {
				share_id: userId,
				ispass: 1
			}
		})

		let page = new Page()
		page.setPageSize(parseInt(pageSize))
		page.setPageNum(parseInt(pageNum))
		page.setTotalRecord(parseInt(totalSongNum))
		let startIndex = page.getStartRecord()
		let num = page.getPageNum()
		let size = page.getPageSize()
    let totalRecord = page.getTotalRecord()
    		
		let list = await songModel.findAll({
			offset: startIndex,
			limit: size,
			where: {
				share_id: userId,
				ispass: 1
      }
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

}

module.exports = UserService