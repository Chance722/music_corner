/**
 *	通用工具类
 */

 const request = require('request')
 const crypto = require('crypto')

 class Common {

 	/**
 	 *	promise化request请求
 	 *  @param  {Object} [非空] opts
 	 *  @return {Promise<[]>}
 	 */
 	static doRequest (opts = {}) {
 		return new Promise((resolve, reject) => {
 			request(opts, (error, response, body) => {
 				if (error || response.statusCode !== 200) {
 					return reject(null)
 				}

 				return resolve(body)
 	 
 			})
 		})
 	}

	/**
	 *	解密 从前端传输过来的加密过的小程序数据
	 *  @param  {String} [非空] encryptedData
	 *  @param  {String} [非空] iv
	 *  @param  {String} [非空] sessionKey
	 *  @param  {String} [非空] appId
	 *  @return {Object} 
	 */
 	static decryptData (encryptedData, iv, sessionKey, appId) {
 		// base64 decode
 		var sessionKey = new Buffer(sessionKey, 'base64')
 		encryptedData = new Buffer(encryptedData, 'base64')
 		iv = new Buffer(iv, 'base64')

 		try {
 		   // 解密
 		  var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
 		  // 设置自动 padding 为 true，删除填充补位
 		  decipher.setAutoPadding(true)
 		  var decoded = decipher.update(encryptedData, 'binary', 'utf8')
 		  decoded += decipher.final('utf8')
 		  
 		  decoded = JSON.parse(decoded)

 		} catch (err) {
 		  throw new Error('Illegal Buffer')
 		}

 		if (decoded.watermark.appid !== appId) {
 		  throw new Error('Illegal Buffer')
 		}

 		return decoded
 	}


 }

  module.exports = Common