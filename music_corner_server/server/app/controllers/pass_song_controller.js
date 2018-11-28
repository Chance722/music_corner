const passSongService = require('../services/pass_song_service')

class PassSongController {

  /**
	 *	@param {number} pageSize
	 *  @param {number} pageNum
	 */
	static async listRecommendSongs(ctx) {
		return passSongService.listRecommendSongs(ctx)
  }
  
  /**
   * 
   *  @param {number} id 
   */
  static async getSong(ctx) {
    return passSongService.getSong(ctx)
  }

}

module.exports = PassSongController