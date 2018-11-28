const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let songsPraiseModel = sequelize.define('songs_praise', {
	id	          : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	songId        : { type: Sequelize.INTEGER, allowNull: false },
	userId        : { type: Sequelize.INTEGER, allowNull: false },
	isPraise      : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	praiseTime    : { type: Sequelize.DATE }
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'songs_praise',
	timestamps      :  false
})

module.exports = songsPraiseModel