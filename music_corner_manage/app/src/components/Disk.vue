<template>
	<div class="disk-container" :class="{'playing': isplaying}">
		<div class="disk">
			<div class="wrapper">
				<div class="disk-img" :class="{'rotating': isRotating}">
					<img :src="songData.cover">
					<button :class="{'show': isShowBtn}" class="replay-btn"></button>
				</div>
			</div>
			<div class="info">
				<p><label>歌名：</label><span>{{songData.name}}</span></p>
				<p><label>作者：</label><span class="html-span" v-html="songData.author"></span></p>
			</div>
		</div>
		<div class="disk-bg" @click="closeDisk"></div>
		<audio ref="musicAudio" :src="songData.qiniu_url" @canplay="playMusic" @ended="musicOver" @error="musicError"></audio>
	</div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
	name: 'disk',
	props: ['isplaying','songData'],
	data () {
		return {
			isRotating: false,
			isShowBtn: false
		}
	},
	methods: {
		closeDisk () {
			this.$eventhub.$emit('closeDisk')
		},
		playMusic () {
			this.isRotating = true
			this.$refs.musicAudio.play()
		},
		musicOver () {
			this.isRotating = false
			this.isShowBtn = true
		},
		musicError (e) {
			if(e.target.error && e.target.error.message)
				Toast(e.target.error.message)
		}
	},
	watch: {
		isplaying (newVal, oldVal) {
			if(!newVal)
				this.$eventhub.$emit('clearSongData')
		}
	}
}
</script>

<style lang="scss" scoped>

	@import '../assets/css/common.scss';

	.disk-container{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		pointer-events: none;
	} 

	.disk-bg{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 98;
	} 


	.disk{
		position: fixed;
		width: 0;
		height: 0;
		background-color: #1e1e1e;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		transition: all .5s ease;
		z-index: 99;


		.wrapper{
			width: 100%;
			height: rem(550);

			@keyframes rotate{
				0%{
					transform: rotate(0deg);
				}
				100%{
					transform: rotate(360deg);
				}
			}

			.disk-img{
				width: 0;
				height: 0;
				left: 50%;
				top: 40%;
				transition: all .5s ease;
				background: {
					image: url(../assets/images/disc-wrap.png);
					size: 100% 100%;
				}
				position: absolute;

				img{
					position: absolute;
					left: 50%;
					top: 50%;
					width: 62%;
					transform: translate(-50%, -50%);
					border-radius: 50%;
				}

				button.replay-btn{
					background: rgba(255,255,255,0);
					border: none;
					outline: none;
					width: 25%;
					height: 25%;
					left: 37.5%;
					top: 37.5%;
					position: absolute;
					background-size: 100% 100%;
				}
			}

			.info{
				display: none;
			}

			.rotating{
				animation: rotate 10s linear 1s infinite;
				will-change: transform;
			}
		}

		.info{
			width: 100%;
			height: rem(100);
			color: #fff;
			text-align: center;
      font-size: rem(26);
      label,span{
        display: inline-block;
        vertical-align: middle;
      }

			p{
				line-height: rem(50);
			}
		}

	}

	.playing{
		pointer-events: auto;
	}

	.playing .disk{
		width: rem(600);
		height: rem(700);

		.disk-img{
			width: rem(460);
			height: rem(460);
			margin-left: rem(-230);
			margin-top: rem(-230);
		}

		.info{
			display: block;
		}

		button.replay-btn{
			background-image: url(../assets/images/music_disk_play.png);
		}
	}


</style>