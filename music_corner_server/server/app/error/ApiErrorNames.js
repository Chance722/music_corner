/**
 *	API错误名称
 */
 let ApiErrorNames = {}
 ApiErrorNames.USER = {}
 ApiErrorNames.ADMIN = {}
 ApiErrorNames.WX = {}


 ApiErrorNames.UNKNOW_ERROR = 'UNKNOW_ERROR'   //未知错误
 ApiErrorNames.USER_NOT_EXIST = 'USER_NOT_EXIST' //用户不存在
 ApiErrorNames.LACK_PARAMS_ERROR = 'LACK_PARAMS_ERROR' //缺少参数
 ApiErrorNames.PUPPETEER_ERROR = 'PUPPETEER_ERROR' //puppeteer页面抓取失败
 ApiErrorNames.UNKNOW_STAGE_ERROR = 'UNKNOW_STAGE_ERROR' //未知平台
 ApiErrorNames.SONG_NOT_EXIST = 'SONG_NOT_EXIST' //歌曲不存在
 ApiErrorNames.DATABASE_ERROR = 'DATABASE_ERROR' //数据库错误


//User module Error
ApiErrorNames.USER.ATTENTION_AGAIN_ERROR = 'ATTENTION_AGAIN_ERROR' //已经关注过
ApiErrorNames.USER.FOLLOW_SELF_ERROR = 'FOLLOW_SELF_ERROR' //不能关注自己


 //Admin module Error
 ApiErrorNames.ADMIN.ADMIN_EXIST_ERROR = 'ADMIN_EXIST_ERROR' //已存在同名账号
 ApiErrorNames.ADMIN.ADMIN_EMPTY_ERROR = 'ADMIN_EMPTY_ERROR' //账号不能为空
 ApiErrorNames.ADMIN.PASSWORD_EMPTY_ERROR = 'PASSWORD_EMPTY_ERROR' //密码不能为空
 ApiErrorNames.ADMIN.CONFIRM_ERROR = 'CONFIRM_ERROR' //账户名或密码错误
 ApiErrorNames.ADMIN.TOKEN_ERROR ='TOKEN_ERROR' //token信息验证失败
 ApiErrorNames.ADMIN.INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD' // 两次密码不一致
 ApiErrorNames.ADMIN.OLDPWD_CONFIRM_FAIL = 'OLDPWD_CONFIRM_FAIL' // 旧密码输入错误

 //WX API Error
 ApiErrorNames.WX.LOGIN_ERROR = 'LOGIN_ERROR'

 /**
  *		API错误名称对应的错误信息
  */
  const error_map = new Map()

  error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' })

  error_map.set(ApiErrorNames.USER_NOT_EXIST, { code: 1001, message: '用户不存在' })

  error_map.set(ApiErrorNames.LACK_PARAMS_ERROR, { code: 1002, message: '缺少参数' })

  error_map.set(ApiErrorNames.PUPPETEER_ERROR, { code: 1003, message: 'puppeteer页面抓取失败' })

  error_map.set(ApiErrorNames.UNKNOW_STAGE_ERROR, { code: 1004, message: '未知平台' })

  error_map.set(ApiErrorNames.SONG_NOT_EXIST, { code: 1005, message: '歌曲不存在' })

  error_map.set(ApiErrorNames.DATABASE_ERROR, { code: 1006, message: '未知错误，请联系管理员' })


//User
  error_map.set(ApiErrorNames.USER.ATTENTION_AGAIN_ERROR , { code: 2001, message: '已经关注过了' })
  error_map.set(ApiErrorNames.USER.FOLLOW_SELF_ERROR , { code: 2002, message: '不能关注自己' })


// Admin
  error_map.set(ApiErrorNames.ADMIN.ADMIN_EMPTY_ERROR, { code: 3001, message: '账号不能为空' })

  error_map.set(ApiErrorNames.ADMIN.PASSWORD_EMPTY_ERROR, { code: 3002, message: '密码不能为空' })

  error_map.set(ApiErrorNames.ADMIN.CONFIRM_ERROR, { code: 3003, message: '账户名或密码错误' })

  error_map.set(ApiErrorNames.ADMIN.ADMIN_EXIST_ERROR , { code: 3004, message: '已存在同名账号' })

  error_map.set(ApiErrorNames.ADMIN.TOKEN_ERROR, { code: 3005, message: 'token信息验证失败' })

  error_map.set(ApiErrorNames.WX.LOGIN_ERROR, { code: 3006, message: '授权登录失败' })

  error_map.set(ApiErrorNames.ADMIN.INCONSISTENT_PASSWORD, { code: 3007, message: '两次密码不一致' })

  error_map.set(ApiErrorNames.ADMIN.OLDPWD_CONFIRM_FAIL, { code: 3008, message: '旧密码输入错误' })

  /**
   *	根据错误名称获取错误信息 
   */
   ApiErrorNames.getErrorInfo = (error_name) => {
   		let error_info
   		if(error_name) {
   			error_info = error_map.get(error_name)
   		}
   		if(!error_info) {
   			error_name = ApiErrorNames.UNKNOW_ERROR
   			error_info = error_map.get(error_name)
   		}

   		return error_info
   }

   module.exports = ApiErrorNames
