/**
 *	Sequelize实例化文件
 */
const Sequelize = require('sequelize')
const config = require('../../config/database')

let sequelize = new Sequelize(
		config.database.DATABASE,
		config.database.USERNAME,
		config.database.PASSWORD,
		{
			host    : config.database.HOST,
			port    : config.database.PORT,
			dialect : 'mysql',
			define  : { timestamps : false },
			native  : false,
			// operatorsAliases: false 如果没加会报错警告： sequelize deprecated String based operators are now deprecated. Please use Symbol based operators for better security
			// 参考链接 http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
			operatorsAliases: false
		}
	)

module.exports = sequelize
