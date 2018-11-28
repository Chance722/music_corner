<template>
	<div class="index-view">
		<div class="nav-bar">
			<span :class="{'active': active === 'tab-container1'}" @click="active='tab-container1'">留言列表</span>
			<span :class="{'active': active === 'tab-container2'}" @click="active='tab-container2'">歌曲列表</span>
			<span :class="{'active': active === 'tab-container3'}" @click="active='tab-container3'">数据统计</span>
		</div>
		<mt-tab-container v-model="active">
		  <mt-tab-container-item id="tab-container1">
		  		1
		  </mt-tab-container-item>
		  <mt-tab-container-item id="tab-container2">
		  	<div class="song-list-container"
		  		 v-infinite-scroll="loadMore" 
		  		 infinite-scroll-disabled="isLoading" 
		  		 infinite-scroll-distance="10" 
		  		 infinite-scroll-immediate-check="false"
		  	>
		    	<song-list :songList="songList"></song-list>
			</div>
			<!--分页loading-->
			<div v-show="isShowLoading" class="loading-bar">
				<mt-spinner color="#f03849" type="fading-circle">
				</mt-spinner>
				<span>加载中...</span>
			</div>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="tab-container3">
		    3
		  </mt-tab-container-item>
		</mt-tab-container>
	</div>
</template>


<script>
import Vue from 'vue'
import api from '@/api'
import qs from 'qs'
import XLSX from 'xlsx'
import { mapState, mapActions } from 'vuex'
import { InfiniteScroll, Indicator, TabContainer, TabContainerItem } from 'mint-ui'
import SongList from '@/components/SongList'


Vue.use(InfiniteScroll)
Vue.use(Indicator)
Vue.use(TabContainer)
Vue.use(TabContainerItem)

export default {
	name: 'index-view',
	components: {
		'song-list': SongList
	},
	data () {
		return {
			active: 'tab-container2',
			pageSize: 10,
			pageNum: 1,
			songList: [],
			isLoading: false,
			totalNum: 0
		}
	},
	computed: {
		isShowLoading: function() {
			// console.log(this.songList.length < this.totalNum && this.isLoading)
			return (this.songList.length < this.totalNum ) && this.isLoading
		}
	},
	methods: {
		listSong () {
			this.$axios({
				url: api.listSong,
				method: 'post',
				data: qs.stringify({
					pageSize: this.pageSize,
					pageNum: this.pageNum
				}),
				headers: {
					'authorization': localStorage.getItem('userToken') || ''
				}
			}).then(res => {
				this.isLoading = false
				Indicator.close()
				if(res.data.code === 0) {
					this.totalNum = res.data.data.totalRecord
					if(this.pageNum > 1) {
						this.songList = this.songList.concat(res.data.data.list)
					}else {
						this.songList = []
						this.songList = res.data.data.list
					}
				}
			})
    },
    listCollectSongs () {
      this.$axios({
        url: api.listCollectSongs,
        method: 'post',
        data: qs.stringify({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          userId: 2
        })
      }).then(res => {
          console.log(res)
      })
    },
		loadMore () {
			if(this.songList.length < this.totalNum && !this.isLoading) {
				this.isLoading = true
				this.pageNum++
				this.listSong()
			}
		}
	},
	created () {
		Indicator.open()
    this.listSong()
    this.listCollectSongs()
	}
}

</script>


<style lang="scss" scoped>

 @import '../assets/css/common.scss';

.index-view{

	.nav-bar{
		background: #1d242a;
		color: #fff;
		height: rem(80);
		line-height: rem(80);
		display: flex;
		padding: 0 rem(40);

		span{
			flex: 1;
			text-align: center;
		}
    span.active{
      color: #1cafff;
    }
	}
	
	.loading-bar{
		height: 40px;
		padding-top: 6px;
		border-top: 1px #f9f9f9 solid;
		text-align: center;
		color: #999;

		span{
			vertical-align: middle;
			display: inline-block;
		}

	}
}

</style>