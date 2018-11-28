const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let adminModel = sequelize.define('admin', {
	id	     : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	name     : { type: Sequelize.STRING(100), allowNull: false },
	pwd      : { type: Sequelize.STRING(100), allowNull: false },
	avator   : { type: Sequelize.STRING(100) },
	token    : { type: Sequelize.STRING(200)},
	reg_time : { type: Sequelize.DATE },
	last_login_time  : { type: Sequelize.DATE }
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'admin',
	timestamps      :  false
})

module.exports = adminModel