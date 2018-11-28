<template>
	<div class="slide-menu" :class="{'open' : isOpen}">
		<header>
			<i class="logo"></i>
			<p>Music Corner</p>
			<button @click="isOpen = false" class="back"></button>
		</header>
		<div class="menu-list">
			<ul>
        <li @click="linkTo('index')"><span>首页</span></li>
				<li @click="linkTo('info')"><span>修改资料</span></li>
				<li><span>关于Music Corner</span></li>
				<li @click="logout()"><span>退出登录</span></li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
	name: 'slide-menu',
	data() {
		return {
			isOpen: false
		}
	},
	methods: {
    ...mapMutations([
      'setUserInfo'
    ]),
		linkTo (routeName) {
		  this.isOpen = false
			this.$router.push({
				name: routeName
			})
    },
    logout () {
      localStorage.removeItem('userToken')
      this.setUserInfo(null)
      this.linkTo('login')
    }
	},
	created() {
		this.$eventhub.$on('toggleMenu', isOpen => {
			this.isOpen = isOpen
		})
	}
}
</script>

<style lang="scss" scoped>

	@import '../assets/css/common.scss';

	.slide-menu{
		display: box;
		height: 100%;
		width: rem(440);
		background: #24292e;
		position: absolute;
		top: 0;
		left: 0;
		box-shadow: none;
		transform: translate3d(-100%,0,0);
		transition: all 0.3s cubic-bezier(0.55, 0, 0.55, 0.2), width 0.3s linear;
		z-index: 999;

		header{
			height: rem(100);
			font-size: rem(30);
			line-height: rem(100);
			padding-left: rem(100);
			color: #fff;
			background: #464c5b;
			position: relative;
			box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

			i.logo{
				position: absolute;
				display: inline-block;
				width: rem(68);
				height: rem(60);
				top: rem(20);
				left: rem(20);
				background-image: url(../assets/images/music_logo2.png);
				background-size: 100% 100%;
			}

			button{
				width: rem(60);
				height: rem(60);
				position: absolute;
				background: rgba(0,0,0,0);
				background-image: url(../assets/images/left_arrow.png);
				background-size: 100% 100%;
				border: none;
				outline: none;
				position: absolute;
				right: rem(20);
				top: rem(20);
			}
		}

		.menu-list{
			ul{
				padding: rem(40) rem(40);
				color: #fff;
				font-size: rem(28);
				font-family: '微软雅黑';

				li{
					height: rem(80);
					line-height: rem(80);
					border-bottom: 1px solid #444d56;
					position: relative;
				}

				li > a{
					color:#fff;
					text-decoration: none;
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
				}
			}
		}
	}

	.slide-menu.open{
		box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
		transform: translate3d(0,0,0);
	}
</style>