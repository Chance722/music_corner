/**
 *	防盗链链接视频转换并上传到七牛
 */
 const http = require('http')
 const request = require('request')
 const fs = require('fs')
 const qiniu = require('qiniu')
 const Base64 = require('js-base64').Base64
 const querystring = require('querystring')
 const zlib = require('zlib')


 class Qiniu {

 	constructor(params) {
 		this.url = params.url || ''
 		this.fileName = params.fileName || ''
 		this.name = params.name || ''
 		this.author = params.author || ''
    this.shareTime = params.shareTime || ''
 		this.bucket = 'musiccorner'
 		this.accessKey = 'uGfIINWyiSdl1ED8gCNMQ9bLz0XfP0iTs0RibVqH'
 		this.secretKey = 'm-2ZG9dbC-t1r2vTZ5cXEoxtnJKi4ciWFXzj2oun'
 		//生成mac标识
 		this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
 		//默认配置对应华东机房
 		this.config = new qiniu.conf.Config()
 		this.config.zone = qiniu.zone.Zone_z0

   }

 	async uploadFileToQN() {
 		let option = {
 			hostname: 'dl.stream.kg.qq.com',
 			path: this.url.replace('http://dl.stream.kg.qq.com',''),
 			headers: {
 				'Host': 'dl.stream.kg.qq.com',
 				'Content-Type': 'audio/mp4',
 				'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36'
 			}
 		}

 		http.get(option, (res) => {
 			//保存到本地
 			// let stream = fs.createWriteStream('jowen.mp4')
 			// res.pipe(stream)

 			//上传到七牛存储空间
 			let options = {
 			  scope: this.bucket,
 			};
 			let putPolicy = new qiniu.rs.PutPolicy(options);
 			let uploadToken = putPolicy.uploadToken(this.mac);

 			let formUploader = new qiniu.form_up.FormUploader(this.config);
 			let putExtra = new qiniu.form_up.PutExtra();
 			let readableStream = res; // 可读的流
 			//文件名由 作者+歌名+分享时间 组成
 			let fileName = this.fileName
 			formUploader.putStream(uploadToken, fileName, readableStream, putExtra, function(respErr,
 			  respBody, respInfo) {
 			  if (respErr) {
 			    throw respErr;
 			  }
 			  if (respInfo.statusCode == 200) {
 			    console.log(respBody);
 			  } else {
 			    console.log(respInfo.statusCode);
 			    console.log(respBody);
 			  }
 			});

 		})
 	}

 	async deleteFileFromQN () {
 		//console.log('what the fuck?')
 		let bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
 		let fileName = this.fileName
 		bucketManager.delete(this.bucket, fileName, (err, respBody, respInfo) => {
 			if(err) {
 				console.log(err)
 			} else{
 				console.log(respInfo.statusCode)
 				console.log(respBody)
 			}
 		})
 	}	
 }

 module.exports = Qiniu