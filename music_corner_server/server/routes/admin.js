let router = require('koa-router')()
let adminctrl = require('../app/controllers/admin_controller')

router.post('/regist', adminctrl.regist)
router.post('/login', adminctrl.login)
router.get('/getAdmin', adminctrl.getAdmin)
router.post('/upload', adminctrl.upload)
router.post('/updateAdmin', adminctrl.updateAdmin)

module.exports = router