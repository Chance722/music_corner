const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let songModel = sequelize.define('songs', {
	id	   	 	: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	name   	 	: { type: Sequelize.STRING(200), allowNull: false },
	author   	: { type: Sequelize.STRING(400) },
	avator   	: { type: Sequelize.STRING(100) },
	stage    	: { type: Sequelize.STRING(60) },
	share_id 	: { type: Sequelize.INTEGER, unique: true, allowNull: false },
	share_time	: { type: Sequelize.DATE },
  song_url    : { type: Sequelize.STRING(800), allowNull: false },
  cover: { type: Sequelize.STRING(400) },
	qiniu_url   : { type: Sequelize.STRING(800) },
	lyric_url   : { type: Sequelize.STRING(800) },
	description : { type: Sequelize.STRING(200) },
	tag			: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	ispass		: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'songs',
	timestamps      :  false
})

module.exports = songModel