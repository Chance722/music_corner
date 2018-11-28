const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

let usersAttentionModel = sequelize.define('users_attention', {
	id	         : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
	userId       : { type: Sequelize.INTEGER, allowNull: false },
	followId     : { type: Sequelize.INTEGER, allowNull: false },
	followTime   : { type: Sequelize.DATE },
	isFollowEach : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
	
}, {
	freezeTableName :  true, //默认false修改表名为复数, true不修改表名, 与数据库同步
	tableName       :  'users_attention',
	timestamps      :  false
})

module.exports = usersAttentionModel