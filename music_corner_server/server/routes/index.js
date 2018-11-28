let router = require('koa-router')()
let admin = require('./admin')
let user = require('./user')
let song = require('./song')

router.use('/api/admin', admin.routes(), admin.allowedMethods())
router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/song', song.routes(), song.allowedMethods())

module.exports = router