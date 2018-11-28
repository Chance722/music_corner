const userService = require('../services/user_service')

class UserController {

	/**
	 *	@params {String} [非空] code
	 *		    {Object} [非空] userData	
	 */
	static async login(ctx) {

		return userService.login(ctx)

	}

	/**
	 *	@params {String} [非空] introduction
	 *  @params {Number} [非空] userId
	 */
	static async update(ctx) {

		return userService.update(ctx)

	}


	/**
	 *	@params {Number} [非空] id
	 *  @params {Number} [非空] fllowId
	 */
	static async attention(ctx) {

		return userService.attention(ctx)

	}

	/**
	 *  @params {Number} [非空] type
	 *  @params {Number} [非空] userId
	 *  @params {Number} [非空] songId	
	 */
	static async doOperation(ctx) {

		return userService.doOperation(ctx)

	}

	/**
	 *	@params {Number} [非空] userId
	 *			{Number} pageSize
	 *          {Number} pageNum
	 */
	static async listCollectSongs(ctx) {

		return userService.listCollectSongs(ctx)

	}

	/**
	 *	@params {Number} [非空] userId
	 *			{Number} pageSize
	 *          {Number} pageNum
	 */
	static async listShareSongs(ctx) {

		return userService.listShareSongs(ctx)

	}

	/**
	 *	@params {Number} [非空] userId
	 *			{Number} pageSize
	 *          {Number} pageNum
	 */
	static async listAttentions(ctx) {

		return userService.listAttentions(ctx)

	}

}

module.exports = UserController