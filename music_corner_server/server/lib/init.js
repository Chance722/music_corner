/**
 *	数据库初始化建表文件
 */

const mysql = require('./mysql')
const tab = require('./tab')

//初始化表操作
for (let key in tab) {
	mysql.createTable(tab[key]).then(res => {
		console.log(`lib/init createTable res ${res}`)
	}).catch(error => {
		console.error(`lib/init createTable error ${error}`)
	})
}

// // 初始化用户表
// mysql.createTable(tab.users)
// 	.then(res => {
// 	  console.log(`lib/init createTable res ${res}`)
// 	})
// 	.catch(error => {
// 	  console.error(`lib/init createTable error ${error}`)
// 	})

// //初始化歌曲表
// mysql.createTable(tab.songs)
//     .then(res => {
//       console.log(`lib/init createTable res ${res}`)
//     })
//     .catch(error => {
//       console.error(`lib/init createTable error ${error}`)
//     })
