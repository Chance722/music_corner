<template>
	<div class="song-list">
		<div class="header">
			<span class="flex1">平台</span>
			<span class="flex3">歌曲信息</span>
			<span class="flex1">审核</span>
		</div>
		<div class="content">
			<ul ref="contentRef">
				<template v-for="(item,index) in songList">
					<li :key="index" :class="{'slideAway': slideIndex === index}" :ref="'song_item_'+index" @click="listenMusic(item)" @webkitAnimationEnd="removeSelf(index)">
						<span class="flex1 stage">{{item.stage}}</span>
						<span class="flex3 info">
							<p class="author"><label>作者：</label><span class="html-span" v-html="item.author"></span></p>
							<p class="song-name"><label>歌名：</label><span>{{item.name}}</span></p>
							<p class="share-id"><label>分享人：</label><span>{{item.share_id}}</span></p>
						</span>
						<span class="flex1 btns">
							<mt-button @click.stop="isPass(item.id, true, index)" class="btn" type="primary">通过</mt-button>
							<mt-button @click.stop="isPass(item.id, false, index)" class="btn" type="danger">淘汰</mt-button>
						</span>
					</li>
				</template>
			</ul>
		</div>
		<disk :isplaying="isplaying" :songData="songData"></disk>
	</div>
</template>

<script>
import Vue from 'vue'
import { Button,Indicator,Toast } from 'mint-ui'
import Disk from '@/components/Disk'
import api from '@/api'
import qs from 'qs'
Vue.use(Button)

export default {
	name: 'song-list',
	props: ['songList'],
	components: {
		'disk': Disk
	},
	data () {
		return {
			slideIndex: null,
			isplaying: false,
			songData: {}
		}
	},
	methods: {

		listenMusic(item) {
			this.isplaying = true
			this.songData = item
		},

		isPass(songId, flag, index) {

			this.$axios({
				url: api.updateStatus,
				method: 'post',
				data: {
					id: songId,
					flag: flag
				},
				headers: {
					'authorization': localStorage.getItem('userToken')
				}
			}).then(res => {
				if(res.data.code === 0) {
					Toast(res.data.message)
					this.slideIndex = index
				}
			})
		},

		removeSelf(index) {

			this.$refs.contentRef.removeChild(this.$refs['song_item_'+index][0])
	
		}
	},
	created () {
		this.$eventhub.$on('closeDisk', () => {
			this.isplaying = false
		})
		this.$eventhub.$on('clearSongData', () => {
			this.songData = {}
		})
	} 
}
</script>

<style lang="scss" scoped>

@import '../assets/css/common.scss';

.song-list{

	.flex2{
		flex: 2;
	}
	.flex3{
		flex: 3;
	}
	.flex1{
		flex: 1;
	}

	.header{
		margin: 0 rem(40);
		padding: rem(40) 0 rem(20);
		display: flex;
		border-bottom: 1px solid #e7e7e7;

		span{
			color: gray;
			text-align: center;
		}
	}

	.content{

		ul{
			padding: rem(20) rem(40);

			@keyframes slideUp{
				from{
					height: rem(140);
					padding: rem(20) 0;
					opacity: 1;
				}
				to{
					height: 0;
					padding: 0;
					opacity: 0;
				}
			}

			li{
				height: rem(140);
				padding: rem(20) 0;
				display: flex;
				border-bottom: 1px solid #e7e7e7;
				transform: translate3d(0, 0, 0);
				transition: all .5s ease;

				span.stage{
					line-height: rem(140);
				}

				span.btns{
					text-align: center;
				}

				span{
					vertical-align: middle;
					text-align: center;

					p{
						height: rem(50);
						padding-left: rem(60);
						text-align: left;

						label{
							width: rem(100);
              display: inline-block;
              vertical-align: middle;
							color: gray;
							margin-right: rem(10);
						}
            span.html-span{
              display: inline-block;
              vertical-align: middle;
              white-space: nowrap;
              width: rem(220);
              overflow: hidden;
              text-overflow: ellipsis;
            }
					}

					.btn{
						margin: 0;
						padding: 0;
						font-size: rem(24);
						width: rem(120);
						height: rem(50);
						margin-bottom: rem(20);
					}
				}

			}

			li.slideAway{
				transform: translate3d(100%, 0, 0);
				animation: slideUp .5s ease .6s;
			}
		}
	}

}
</style>