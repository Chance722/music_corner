<template>
	<header>
		<div class="top-bar">
			<button @click="openMenu" class="menu"></button>
			<div class="head-photo"><img :src="headImg"></div>
		</div>
	</header>
</template>

<script>
export default {
	name: 'app-header',
	props: ['headImg'],
	data () {
		return {}
	},
	methods: {
		openMenu() {
			this.$eventhub.$emit('toggleMenu', true)
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/css/common.scss';

header{
	width: 100%;
	background: #1d242a;
	height: rem(100);

	.top-bar{
		width: 100%;

		button{
			border: none;
			outline: none;
			width: rem(64);
			height: rem(64);
			background-color: rgba(0,0,0,0);
			display: inline-block;
			position: absolute;
			top: rem(18);
		}

		div.head-photo{
			display: inline-block;
			width: 100%;
			text-align: center;

			img{
				display: inline-block;
				border: none;
				border-radius: 50%;
				width: rem(70);
				height: rem(70);
				margin: rem(15) auto;
			}
		}

		button.menu{
			background: {
				image: url(../assets/images/menu_icon.png);
				size: 100% 100%;
			}
			left: rem(24);
		}

	}

}
</style>