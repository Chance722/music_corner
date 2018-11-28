const mysql = require('mysql')
const config = require('../config/database')


let pool = mysql.createPool({
	host: config.database.HOST,
	user: config.database.USERNAME,
	password: config.database.PASSWORD,
	database: config.database.DATABASE
})

let query = (sql, values) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						console.log('lib/mysql query sql语句: ' + sql + '执行成功.')
						resolve(rows)
					}
					connection.release()
				})
			}
		})
	})
}


let createTable = (sql) => {
	return query(sql, [])
}

module.exports = {
	query,
	createTable
}