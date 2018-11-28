const adminService = require('../services/admin_service')

class AdminController {

	static async regist(ctx) {
		return adminService.regist(ctx)
	}

	static async login(ctx) {
		return adminService.login(ctx)
	}

	static async getAdmin(ctx) {
		return adminService.getAdmin(ctx)
  }
  
  static async upload(ctx) {
    return adminService.upload(ctx)
  }

  static async updateAdmin(ctx) {
    return adminService.updateAdmin(ctx)
  }


}

module.exports = AdminController