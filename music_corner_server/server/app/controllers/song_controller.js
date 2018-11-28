const songService = require('../services/song_service')

class SongController {
	
	/**
	 *	@params {String} [非空] url
	 *		      {Number} [非空] userId
	 *		      {String} desc	
	 */
	static async addSong(ctx) {

		return songService.addSong(ctx)

	}

	/**
	 *	@params {Number} [非空] id
	 */
	static async getSong(ctx) {
		
		return songService.getSong(ctx)

	}

	/**
	 *	@params {Number} pageSize
	 *          {Number} pageNum
	 */
	static async listSong(ctx) {

		return songService.listSong(ctx)

	}

	/**
	 *	@params {Number} pageSize
	 *          {Number} pageNum
	 */
	static async listSongFront(ctx) {

		return songService.listSongFront(ctx)

	}

	/**
	 * @params {Number}  [非空] id
	 * 		   {Boolean} [非空] flag
	 */
	static async updateStatus(ctx) {

		return songService.updateStatus(ctx)

	}


	/**
	 * @params {Number}  [非空] id
	 */
	static async deleteFile(ctx) {

		return songService.deleteFile(ctx)

	}

	/**
	 * @params {String} [非空] keywords
	 */
	static async doSearch(ctx) {

		return songService.doSearch(ctx)

	}

	static async listSongsTag(ctx) {

		return songService.listSongsTag(ctx)

	}

	/**
	 *	@params {Number} pageSize
	 *          {Number} pageNum
	 *			{Number} tagId
	 */
	static async listSongByTag(ctx) {

		return songService.listSongByTag(ctx)

	}

}

module.exports = SongController