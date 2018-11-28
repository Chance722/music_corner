let router = require('koa-router')()
let songctrl = require('../app/controllers/song_controller')
let passSongCtrl = require('../app/controllers/pass_song_controller')

// 通用歌曲接口
router.get('/addSong', songctrl.addSong)
router.get('/getSong', songctrl.getSong)
router.post('/listSong', songctrl.listSong)
router.post('/listSongFront', songctrl.listSongFront)
router.post('/updateStatus', songctrl.updateStatus)
router.get('/deleteFile', songctrl.deleteFile)
router.post('/search', songctrl.doSearch)
router.get('/listSongsTag', songctrl.listSongsTag)
router.post('/listSongByTag', songctrl.listSongByTag)

// 已通过的歌曲相关接口
router.post('/listRecommendSongs', passSongCtrl.listRecommendSongs)
router.get('/getPassSong', passSongCtrl.getSong)

module.exports = router