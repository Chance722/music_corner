const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let songsTagModel = sequelize.define('songs_tag', {
	id	   	 	: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	tag_name   	: { type: Sequelize.STRING(40) },
	cover       : { type: Sequelize.STRING(100) }
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'songs_tag',
	timestamps      :  false
})

module.exports = songsTagModel