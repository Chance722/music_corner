const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let userModel = sequelize.define('users', {
	id	         : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	nickname     : { type: Sequelize.STRING(100), allowNull: false },
	avator	     : { type: Sequelize.STRING(400), allowNull: false },
	level	     : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
	sex			 : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
	country      : { type: Sequelize.STRING(60) },
	province     : { type: Sequelize.STRING(60) },
	city         : { type: Sequelize.STRING(60) },
	introduction : { type: Sequelize.STRING(200) },
	fans		 : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	follow		 : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	collect		 : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	share		 : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
	openId		 : { type: Sequelize.STRING(100), allowNull: false },
	updateTime   : { type: Sequelize.DATE }
	
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'users',
	timestamps      :  false
})

module.exports = userModel