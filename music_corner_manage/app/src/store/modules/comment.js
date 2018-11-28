// import Vue from 'vue'
// import axios from 'axios'
// import api from '../../../api/api'
// import { Indicator,Toast } from 'mint-ui'

// const state = {
// 	commentList: [],
// 	commentData: {},
// 	myInfo: {},
// 	pageIndex: 0,
// 	commentNum: 0,
// 	commentLoading: false,
// 	canFocus: false
// };


// const mutations = {

// 	setCommentList (state,payload) {
// 		state.myInfo = payload.myInfo;
// 		state.commentData = payload.commentData;
// 		state.commentNum = payload.commentData.commentNum;
// 		state.canFocus = payload.commentData.canFocus;
// 		state.commentList = payload.commentList;
// 		state.pageIndex = payload.pageIndex;
// 	},

// 	setFocusStatus (state,payload) {
// 		state.canFocus = payload.canFocus;
// 	},

// 	setCommentLoading (state,payload) {
// 		state.commentLoading = payload.commentLoading;
// 	},

// 	initCommentStatus (state) {
// 		state.commentList = [];
// 		state.commentData = {};
// 		state.pageIndex = 0;
// 		state.commentNum = 0;
// 		state.commentLoading = false;
// 		state.myInfo = {};
// 	}

// };

// const actions = {

// 	addFocus({commit},payload) {
// 		axios({
// 			url: 'http://api.rcsing.com/index.php',
// 			params: {
// 				param: payload.param
// 			}
// 		}).then(res => {
// 			if(res.data.code === 0) {
// 				Toast('關注成功');
// 				commit({
// 					type: 'setFocusStatus',
// 					canFocus: false
// 				});
// 			}else{
// 				Toast(res.data.message);
// 			}
// 		})
// 	},

// 	getCommentList ({commit},payload) {
// 		axios({
// 			url: api.getCommentList,
// 			method: 'post',
// 			params: {
// 				id: payload.postId,
// 				page: payload.pageIndex,
// 				qty: payload.pageSize,
// 				token: payload.token
// 			}
// 		}).then(res => {
// 			Indicator.close();
// 			commit({
// 				type: 'setCommentLoading',
// 				commentLoading: false
// 			});
// 			console.log(res);
// 			if(res.data.code === 0) {
// 				commit({
// 					type: 'setCommentList',
// 					myInfo: res.data.data.myInfo,
// 					commentList: res.data.data.commentList,
// 					commentData: res.data.data.info,
// 					pageIndex: payload.pageIndex
// 				});
// 			}
// 		})
// 	},

// 	commentForum (payload) {
// 		return axios({
// 			url: api.commentForum,
// 			method: 'post',
// 			params: {
// 				id: payload.postId,
// 				toId: payload.repeatId,
// 				comment:payload.comment,
// 				token: payload.token
// 			}
// 		});
// 	}

// };

// export default {
// 	state,
// 	mutations,
// 	actions
// }