/**
 *	数据爬虫类
 */
const fs = require('fs')
const http = require('http')
const request = require('request')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const puppeteer = require('puppeteer')
const songModel = require('../models/songs')
const Qiniu = require('./qiniu')


class Reptile {
	constructor(query) {
		this.requestUrl = query.url
		this.description = query.desc
		this.shareId = query.userId
		this.tag = query.tag
		this.stage_map = {
			changba: '唱吧',
			quanmin: '全民K歌'
		}
	}

	async doReptile() {

		//创建无头浏览器 并加载需要解析的动态页面
		let browser, page
		try {
			browser = await puppeteer.launch({
				headless: 'headless'
			})
			page = await browser.newPage()
			await page.goto(this.requestUrl,{
			  	waitUntil: 'networkidle0',
			  	timeout: 0
      })

		} catch (error) {
			console.log(error)
			await browser.close()
			throw new ApiError(ApiErrorNames.PUPPETEER_ERROR)
    }

    // 打印爬取到的页面内容
    // let content = await page.content()
    // console.log(content)

		//获取平台名称
		let title = await page.title()
		let stage = this.getStageName(title)
		if(!stage) {
			throw new ApiError(ApiErrorNames.UNKNOW_STAGE_ERROR)
		}
			
		//根据平台名称获取相应页面信息
		let author, name, avator, song_url, lyric_url, cover

		if (stage === this.stage_map.changba) {
      author = await page.$eval('.basic-info .uname', el => el.innerHTML)
			name = await page.$eval('.title', el => el.innerHTML)
      avator = await page.$eval('.basic-info .poster>img', el => el.src)
      let hasCover = false
      await page.evaluate(() => {
        hasCover = document.querySelector('.player-obj>img')
      })
      if (hasCover) {
        cover = await page.$eval('.player-obj>img', el => el.src)
      } else {
        cover = avator
      } 
			song_url  = await page.$eval('#audio', el => el.src)
			lyric_url = ''

		} else if (stage === this.stage_map.quanmin) {
      author = await page.$eval('.singer_user__name', el => el.innerHTML)
			name = await page.$eval('.play_name', el => el.innerHTML)
      avator = await page.$eval('.singer_person>a>img', el => el.src)
      let hasCover = false
      await page.evaluate(() => {
        hasCover = document.querySelector('.play_photo>img')
      })
      if (hasCover) {
        cover = await page.$eval('.play_photo>img', el => el.src)
      } else {
        cover = avator
      }

      
			song_url  = await page.$eval('#player', el => el.src)
			lyric_url = ''
		}

		//用户id,歌曲名字,歌曲音频文件为必传字段
		if(!this.shareId || !song_url || !name)
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)

		//关闭无头浏览器
		await browser.close()

		//返回抓取信息
		return {
			name: name,
			author: author,
			avator: avator,
			stage: stage,
			shareId: this.shareId,
			shareTime: new Date().getTime(),
      songUrl: song_url,
      cover: cover,
			lyricUrl: lyric_url,
			description: this.description,
			tag: this.tag
		}

	}

	/**
	 *	获取平台名称
	 *  param {Object} $  dom操作符
	 */
	getStageName(title) {
		let prefix_index = title.lastIndexOf('-')
		let stage_title_desc = title.substr(prefix_index + 1, title.length)
		if(stage_title_desc.indexOf(this.stage_map.changba) !== -1)
			return this.stage_map.changba
		else if(stage_title_desc.indexOf(this.stage_map.quanmin) !== -1)
			return this.stage_map.quanmin
		else
			return null

	}


 }

 module.exports = Reptile