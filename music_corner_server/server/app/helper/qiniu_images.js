/**
 *	前端图片上传到七牛
 */
const http = require('http')
const request = require('request')
const fs = require('fs')
const qiniu = require('qiniu')
const Busboy = require('busboy')
const inspect = require('util').inspect
const imagePath = 'http://pcd4kcit1.bkt.clouddn.com/'

class Qiniu {

  constructor(ctx) {
    this.ctx = ctx
    this.bucket = 'commonimage'
    this.accessKey = 'uGfIINWyiSdl1ED8gCNMQ9bLz0XfP0iTs0RibVqH'
    this.secretKey = 'm-2ZG9dbC-t1r2vTZ5cXEoxtnJKi4ciWFXzj2oun'
    //生成mac标识
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
    //默认配置对应华东机房
    this.config = new qiniu.conf.Config()
    this.config.zone = qiniu.zone.Zone_z0
  }

  async uploadFileToQN() {
    const _emmiter = new Busboy({ headers: this.ctx.req.headers })

    //上传到七牛存储空间
    let options = {
      scope: this.bucket,
    }
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(this.mac)

    let formUploader = new qiniu.form_up.FormUploader(this.config)
    let putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve, reject) => {
      function rename(fileName) {
        let suffix = fileName.split('.').pop()
        let name = Math.random().toString(16).substr(2) + '.' + suffix
        return name
      }
      let formFields = null
      let formValues = null
      _emmiter.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        formFields = fieldname
        formValues = val
      })
      _emmiter.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const fileName = rename(filename)
        formUploader.putStream(uploadToken, fileName, file, putExtra, (respErr,
          respBody, respInfo) => {
          if (respErr) {
            reject(respErr)
          }
          if (respInfo.statusCode === 200) {
            const lastname = JSON.parse(formValues)['filename']
            this.deleteFileFromQN(lastname)
            resolve(respBody)
          } else {
            reject(respBody)
          }
        })
      })

      _emmiter.on('finish', () => {
      })

      _emmiter.on('error', (err) => {
        reject(err)
      })

      this.ctx.req.pipe(_emmiter)
    })
  }

  async deleteFileFromQN(fileName) {
    if (fileName.indexOf(imagePath) === -1 || fileName.indexOf('default.png') !== -1) return
    let bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
    let filename = fileName.replace(imagePath, '')
    bucketManager.delete(this.bucket, filename, (err, respBody, respInfo) => {
      if (err) {
        console.log(err)
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
      }
    })
  }
}

module.exports = Qiniu