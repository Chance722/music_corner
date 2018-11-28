const baseUrl = process.env.BASE_URL + '/api'

const api = {
	//管理员相关接口
	getAdminInfo : baseUrl + '/admin/getAdmin',
	login: baseUrl + '/admin/login',
  regist: baseUrl + '/admin/regist',
  upload: baseUrl + '/admin/upload',
  updateAdmin: baseUrl + '/admin/updateAdmin',
  //歌曲相关接口
  listCollectSongs: baseUrl + '/user/listShareSongs',
	listSong: baseUrl + '/song/listSong',
	updateStatus: baseUrl + '/song/updateStatus'
}

export default api