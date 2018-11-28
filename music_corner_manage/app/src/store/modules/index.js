// import Vue from 'vue'
// import axios from 'axios'
// import api from '../../../api/api'
// import { Indicator } from 'mint-ui'

// const state = {
// 	isShowImageBox: false,
// 	forumList: [],
// 	pageIndex: 0,
// 	postLoading: false,
// 	postTotalNum: 0,
// 	currentImageIndex: 0,
// 	imageArr: []
// };

// const mutations = {

// 	setImageBoxStatus (state,payload) {
// 		state.isShowImageBox = payload.isShowImageBox;
// 	},

// 	setForumList (state,payload) {
// 		state.forumList = payload.forumList;
// 		state.postTotalNum = payload.postTotalNum;
// 		state.pageIndex = payload.pageIndex;
// 	},

// 	setPostLoading (state,payload) {
// 		state.postLoading = payload.postLoading;
// 	},

// 	setCurrentImageIndex (state,payload) {
// 		state.currentImageIndex = payload.currentImageIndex;
// 	},

// 	initIndexStatus (state) {
// 		state.isShowImageBox = false;
// 		state.forumList = [];
// 		state.pageIndex = 0;
// 		state.postLoading = false;
// 		state.postTotalNum = 0;
// 		state.currentImageIndex = 0;
// 	},
// 	setImageArr (state,payload) {
// 		state.imageArr = payload.imageArr;
// 	}

// };

// const actions = {
// 	getForumList ({commit},payload) {
// 		axios({
// 			url: api.getForumList,
// 			method: 'post',
// 			params: {
// 				page: payload.pageIndex,
// 				qty: payload.pageSize
// 			}
// 		}).then(res => {
// 			console.log(res);
// 			Indicator.close();
// 			commit({
// 				type: 'setPostLoading',
// 				postLoading: false
// 			});
// 			if(res.data.code === 0){
// 				commit({
// 					type:'setForumList',
// 					forumList: res.data.data.list,
// 					postTotalNum: res.data.data.total,
// 					pageIndex: payload.pageIndex
// 				});
// 			}
// 		})
// 	}
// };

// export default {
// 	state,
// 	mutations,
// 	actions
// }