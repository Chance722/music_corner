const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let songsCollectModel = sequelize.define('songs_collect', {
	id	          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	songId        : { type: Sequelize.INTEGER, allowNull: false },
	userId        : { type: Sequelize.INTEGER, allowNull: false },
	isCollect     : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	collectTime   : { type: Sequelize.DATE }
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'songs_collect',
	timestamps      :  false
})

module.exports = songsCollectModel