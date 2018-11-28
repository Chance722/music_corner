const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const dataUtils = require('../helper/dataUtils')
const Reptile = require('../helper/reptile')
const Page = require('../helper/page')
const songModel = require('../models/songs')
const passSongModel = require('../models/pass_songs')
const songsTagModel = require('../models/songs_tag')
const userModel = require('../models/user')
const Op = require('sequelize').Op
const Qiniu = require('../helper/qiniu')
const Base64 = require('js-base64').Base64
const filePath = 'http://p6k1jed2o.bkt.clouddn.com/'

class SongService {

	static async addSong(ctx) {
		if(!ctx.query.url) {
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
		}
		let reptile = new Reptile(ctx.query)
		let data
		//捕获页面爬取抛出的异常
		try{
			data = await reptile.doReptile()
			console.log(data)
		}catch(err) {
			throw err
		}

    // 根据平台赋值不同的qiniu_url
    let qiniuUrl = data.stage === '唱吧' ? data.songUrl : 
      filePath + Base64.encodeURI(data.author.trim() + '_' + data.name + '_' + new Date(data.shareTime).getTime()) + '.mp4'

		//插入song
		if(data) {
      try {
        songModel.create({
          name : data.name,
          author: data.author.trim().replace(/\<img/gi, '<img style="width:15px;height:auto" '),
          avator : data.avator,
          stage : data.stage,
          share_id : data.shareId,
          share_time : data.shareTime,
          song_url : data.songUrl,
          cover: data.cover,
          qiniu_url : qiniuUrl,
          lyric_url : data.lyricUrl,
          description : data.description,
          tag: data.tag
        })
      } catch (e) {
        throw new ApiError(ApiErrorNames.DATABASE_ERROR)
      }

      // 如果是来源全民k歌平台 则同时同步上传文件到七牛
      if (data.stage === '全民K歌') {
        this.uploadToQiniu({
          name: data.name,
          author: data.author.replace(/\<img/gi, '<img style="width:15px;height:auto" '),
          url: data.songUrl,
          shareTime: data.shareTime,
          fileName: Base64.encodeURI(data.author.trim() + '_' + data.name + '_' + new Date(data.shareTime).getTime()) + '.mp4'
        })
      }

			ctx.body = {
				code: 0,
				message: '添加成功'
			}
		}
	}

	static async getSong(ctx) {
		if(!ctx.query.id) {
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
		}
		let song = await songModel.find({
			where: {
				id: ctx.query.id
			}
		})
		if(song) {
			let user = await userModel.find({
				where: {
					id: song.share_id
				}
			})
			if(!user)
				throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
			let data = {
				song_name   : song.name,
				author   	: song.author,
				avator   	: song.avator,
				stage    	: song.stage,
				shareId 	: song.share_id,
				shareName	: user.name,
				shareTime	: new Date(song.share_time).getTime(),
				songUrl     : song.song_url,
				qiniuUrl	: song.qiniu_url,
				lyricUrl    : song.lyricUrl,
				description : song.description
			}
			ctx.body = {
				data: data
			}

		}else{
			throw new ApiError(ApiErrorNames.SONG_NOT_EXIST)
		}
	}

	//后台系统使用
	static async listSong(ctx) {
		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum

		let totalSongNum = await songModel.count({
			where: {
				ispass: 0
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
				ispass: 0
			}
		}).then().catch(err => {
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

	static async listSongFront(ctx) {
		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum

		let totalSongNum = await songModel.count({
			where: {
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
				ispass: 1
			},
			order: [
				['share_time','DESC']
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

	static async updateStatus(ctx) {
		let id = ctx.request.body.id
		let flag = ctx.request.body.flag
		let status = 0
		// 0: 未审核 1: 审核通过 2: 审核不通过
		flag ? status = 1 : status = 2
		try {
			await songModel.update({
			  ispass: status
			}, {
			  where: {
			    id: id
			  }
      })
      if (status === 1) {
        let song = await songModel.find({
          where: {
            id: id
          }
        })
        // 审核通过则将该歌曲信息插入pass_songs表
        await passSongModel.create({
          name: song.name,
          author: song.author,
          avator: song.avator,
          stage: song.stage,
          share_id: song.share_id,
          share_time: song.share_time,
          cover: song.cover,
          song_url: song.song_url,
          qiniu_url: song.qiniu_url,
          lyric_url: song.lyric_url,
          description: song.description,
          tag: song.tag
        })
      } else if (status === 2) {
				//审核不通过的则将七牛上的音频文件删除
				this.deleteFile(id)
			}
			ctx.body = {
				code: 0,
				message: '操作成功'
			}
		} catch(e) {
      console.log(e)
			throw new ApiError(ApiErrorNames.DATABASE_ERROR)
		}
	}

	static async uploadToQiniu(params) {
		let qiniu = new Qiniu(params)
		qiniu.uploadFileToQN()
	}

	static async deleteFile(songId) {

		let song = await songModel.find({
			where: {
				id: songId
			}
		})

		let qiniu = new Qiniu({
			name: song.name,
			author: song.author,
			shareTime: song.share_time,
			fileName: song.qiniu_url.replace(filePath, '')
		})

		qiniu.deleteFileFromQN()
	}

	static async doSearch(ctx) {
		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum
		let keywords = ctx.request.body.keywords

		let totalSongNum = await songModel.count({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.like] : '%'+keywords+'%'
						}
					},
					{
						author: {
							[Op.like] : '%'+keywords+'%'
						}
					}

				]
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



		if( dataUtils.isEmpty(keywords)) {
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
		}

		let list = await songModel.findAll({
			offset: startIndex,
			limit: size,
			where: {
				[Op.or]: [
					{
						name: {
							[Op.like] : '%'+keywords+'%'
						}
					},
					{
						author: {
							[Op.like] : '%'+keywords+'%'
						}
					}

				]	
			}
		}).then().catch(err => {
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

	static async listSongsTag(ctx) {
		let list = await songsTagModel.findAll()

		ctx.body = {
			data: {
				list: list
			}
		}
	}

	static async listSongByTag(ctx) {
		let pageSize = ctx.request.body.pageSize
		let pageNum = ctx.request.body.pageNum
		let tagId = ctx.request.body.tagId

		let totalSongNum = await songModel.count({
			where: {
				tag: tagId
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
				tag: tagId
			}
		}).then().catch(err => {
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

}

module.exports = SongService