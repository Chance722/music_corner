const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const dataUtils = require('../helper/dataUtils')
const adminModel = require('../models/admin')
const crypto = require('crypto')
const jwt = require('koa-jwt')
const jsonWebToken = require('jsonwebtoken')
const secret = 'jwt-secret-722'
const util = require('util')
const verify = util.promisify(jsonWebToken.verify)
const path = require('path')
const Busboy = require('busboy')
const QiniuImage = require('../helper/qiniu_images')
const fs = require('fs')
const imagePath = 'http://pcd4kcit1.bkt.clouddn.com/'

class AdminService {

	static async regist(ctx) {
		let name = ctx.request.body.name
		let pwd  = ctx.request.body.pwd
		if( dataUtils.isEmpty(name) || dataUtils.isEmpty(pwd) )
			throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)

		let admin = await adminModel.findOne({
			where: {
				name: name
			}
		})

		if (admin) {
			throw new ApiError(ApiErrorNames.ADMIN.ADMIN_EXIST_ERROR)
		} else {
      let md5 = crypto.createHash('md5')
      let crypto_pwd = md5.update(pwd).digest('hex')
      let reg_time = new Date().getTime()
			let userName = {
				name: name
      }
      const token = jsonWebToken.sign(userName, secret, {expiresIn: 3600})
			try {
				await adminModel.create({
					name: name,
					pwd: crypto_pwd,
					reg_time: reg_time,
					token: token
				})
				ctx.body = {
					code: 0,
					message: '添加成功'
				}
			} catch (e) {
				throw new ApiError(ApiErrorNames.DATABASE_ERROR)
			}
		}

	}

	static async login(ctx) {
		let name = ctx.request.body.name
		let pwd  = ctx.request.body.pwd

		if( dataUtils.isEmpty(name) )
			throw new ApiError(ApiErrorNames.ADMIN.ADMIN_EMPTY_ERROR)
		if( dataUtils.isEmpty(pwd) )
			throw new ApiError(ApiErrorNames.ADMIN.PASSWORD_EMPTY_ERROR)

		let md5 = crypto.createHash('md5')
		let crypto_pwd = md5.update(pwd).digest('hex')

		let admin = await adminModel.findOne({
			where: {
				name: name,
				pwd: crypto_pwd
			}
		})

		if(admin) {
			//记录最近一次登录时间
			let last_login_time = new Date().getTime()
			//登录的同时 生成唯一token 
			let userName = {
				name: admin.name
			}
			const token = jsonWebToken.sign(userName, secret, {expiresIn: 3600})
			//更新token和登录时间  token用于后续访问验证
			try {
				adminModel.update({
				  token: token,
				  last_login_time: last_login_time
				}, {
				  where: {
				    id: admin.id
				  }
				})
			}catch (err) {
				throw new ApiError(ApiErrorNames.ADMIN.PASSWORD_EMPTY_ERROR)
			}
			ctx.body = {
				data: {
					id    : admin.id,
					token : token
				}
			}
		}else {
			throw new ApiError(ApiErrorNames.ADMIN.CONFIRM_ERROR)
		}  
	}

	static async getAdmin(ctx) {
    let token = ctx.header.authorization
		if (token) {
			let admin = await adminModel.findOne({
				where: {
					token: token
				}
			})
			ctx.body = {
				data: {
					id: admin.id,
					name: admin.name,
					avator: admin.avator,
					last_login_time: new Date(admin.last_login_time).getTime()
				}
			}

		} else {
			throw new ApiError(ApiErrorNames.ADMIN.TOKEN_ERROR)
		}
  }

  /**
   * 
   * @param {object} params type:1 -- 修改名字 type:2 -- 修改头像 type:3 --修改密码
   */
  static async updateAdmin(ctx) {
    let token = ctx.header.authorization
    let params = ctx.request.body.params
    if (token) {
      let admin = await adminModel.findOne({
        where: {
          token: token
        }
      })
      if (!admin) {
        throw new ApiError(ApiErrorNames.ADMIN.CONFIRM_ERROR)
      }
      if ((params.type === 1 && dataUtils.isEmpty(params.name)) || (params.type === 2 && dataUtils.isEmpty(params.avator)) ||
        (params.type === 3 && (dataUtils.isEmpty(params.newpassword) || dataUtils.isEmpty(params.oldpassword)))) {
        throw new ApiError(ApiErrorNames.LACK_PARAMS_ERROR)
        }
      if (params.type === 1) {
        adminModel.update({
          name: params.name
        }, {
          where: {
            id: admin.id
          }
        })
      } else if (params.type === 2) {
        adminModel.update({
          avator: params.avator
        }, {
          where: {
            id: admin.id
          }
        })
      } else if (params.type === 3) {
        let md5 = crypto.createHash('md5')
        let crypto_old_pwd = md5.update(params.oldpassword).digest('hex')
        let new_md5 = crypto.createHash('md5')
        let crypto_pwd = new_md5.update(params.newpassword).digest('hex')
    
        if (crypto_old_pwd !== admin.pwd) {
          throw new ApiError(ApiErrorNames.ADMIN.OLDPWD_CONFIRM_FAIL)
        }
        adminModel.update({
          pwd: crypto_pwd
        }, {
          where: {
            id: admin.id
          }
        })
      }
      ctx.body = {
        code: 0,
        message: '更新成功'
      }
    } else {
      throw new ApiError(ApiErrorNames.ADMIN.TOKEN_ERROR)
    }
  }

  static async rename(fileName) {
    let suffix = fileName.split('.').pop()
    let name = Math.random().toString(16).substr(2) + '.' + suffix
    return name
  }

  static async mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
    return false
  }

  static async uploadFile(ctx, options) {
    const _emmiter = new Busboy({ headers: ctx.req.headers })
    const fileType = options.fileType
    const filePath = path.join(options.path, fileType)
    const confirm = this.mkdirsSync(filePath)
    if (!confirm) {
      return
    }
    return new Promise((resolve, reject) => {
      function rename (fileName) {
        let suffix = fileName.split('.').pop()
        let name = Math.random().toString(16).substr(2) + '.' + suffix
        return name
      }
      _emmiter.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const fileName = rename(filename)
        const saveTo = path.join(path.join(filePath, fileName))
        file.pipe(fs.createWriteStream(saveTo))
        file.on('end', () => {
          resolve({
            imgPath: `/${fileType}/${fileName}`,
            imgKey: fileName
          })
        })
      })

      _emmiter.on('finish', () => {
        console.log('finished...')
      })

      _emmiter.on('error', (err) => {
        console.log('err...')
        reject(err)
      })

      ctx.req.pipe(_emmiter)

    })
  }
  
  static async upload(ctx) {
    // 上传到本地服务器
    // const serverPath = path.join(__dirname, '../../uploads/')
    // const result = await this.uploadFile(ctx, {
    //   fileType: ctx.query.type || 'album',
    //   path: serverPath
    // })
    // 上传到七牛
    const qiniuImage = new QiniuImage(ctx)
    try {
      const result = await qiniuImage.uploadFileToQN()
      console.log('upload images result is: ' + JSON.stringify(result))
      ctx.body = {
        data: {
          imageUrl: imagePath + result.key
        }
      }
    } catch (err) {
      throw new ApiError(ApiErrorNames.DATABASE_ERROR)
    }
    
  }

}

module.exports = AdminService