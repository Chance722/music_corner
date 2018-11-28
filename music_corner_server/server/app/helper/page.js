/**
 * 	分页工具类
 */

 class Page {

 	constructor() {
 		this.pageSize = 20 //每页显示数目
 		this.pageNum = 1  //当前页码
 		this.startRecord = 1 //起始查询记录
 		this.totalPage = 0 //总页数
 		this.totalRecord = 0 //总记录数
 	}

 	getPageNum() {
 		if(parseInt(this.pageNum) <= 0) {
 			return 1
 		}
 		return parseInt(this.pageNum)
 	}

 	setPageNum(pageNum) {
 		if(!pageNum) return
 		this.pageNum = pageNum
 	}

 	getPageSize() {
 		return this.pageSize
 	}

 	setPageSize(pageSize) {
 		if(!pageSize) return
 		this.pageSize = pageSize
 	}

 	getTotalRecord() {
 		if(this.totalRecord < 0) {
 			return 0
 		}
 		return this.totalRecord
 	}

 	setTotalRecord(totalRecord) {
 		this.totalRecord = totalRecord
 	}

 	getTotalPage() {
 		if(this.totalRecord <= 0) {
 			return 0
 		}
 		let size = this.totalRecord / this.pageSize
 		let mod = this.totalRecord % this.pageSize
 		if(mod !== 0)
 			size++
 		this.totalPage = size

 		return this.totalPage
 	}

 	getStartRecord() {
 		return (parseInt(this.pageNum) - 1) * parseInt(this.pageSize)
 	}

 	getEndRecord() {
 		return (parseInt(this.pageNum) - 1) * parseInt(this.pageSize) + parseInt(this.pageSize)
 	}

 }

 module.exports = Page