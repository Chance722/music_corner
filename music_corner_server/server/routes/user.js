let router = require('koa-router')()
let userctrl = require('../app/controllers/user_controller')

router.post('/login', userctrl.login)
router.post('/update', userctrl.update)
router.post('/attention', userctrl.attention)
router.post('/doOperation', userctrl.doOperation)
router.post('/listCollectSongs', userctrl.listCollectSongs)
router.post('/listShareSongs', userctrl.listShareSongs)
router.post('/listAttentions', userctrl.listAttentions)

module.exports = router