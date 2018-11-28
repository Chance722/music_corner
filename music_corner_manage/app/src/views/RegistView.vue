<template>
	<div class="regist-view">
		<header>
			<img src="../assets/images/music_logo.png" alt="logo" />
			<p>- Music Corner Management -</p>
		</header>
		<div class="regist-win">
			<p><input  type="text" ref="nameInput" placeholder="name"></p>
			<p><input type="password" ref="pwdInput" placeholder="password"></p>
			<p><input type="password" ref="pwdInput2" placeholder="repeat password"></p>

		  	<div class="options">
		  		<span class="link"><router-link :to="{name: 'login'}">返回登录</router-link></span>
		  	</div>

			<p><span class="btn" @click="regist">注册</span></p>
		</div>
		<footer>
			<p>Music Corner &copy; 2018</p>
		</footer>
	</div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui'
import api from '@/api'
import qs from 'qs'

export default {
	name: 'regist-view',
	data() {
		return {
			valueData: []
		}
	},
	methods: {
		regist() {
			let name = this.$refs.nameInput.value
			let pwd1 = this.$refs.pwdInput.value
			let pwd2 = this.$refs.pwdInput2.value

			if(!name) {
				this.$refs.nameInput.focus()
				return
			}
			if(!pwd1) {
				this.$refs.pwdInput.focus()
				return
			}
			if(!pwd2) {
				this.$refs.pwdInput2.focus()
				return
			}
			if(pwd1 !== pwd2) {
				Toast('两次密码输入不一致')
				return
			}

			Indicator.open()
			let postData = {
				name: name,
				pwd: pwd1
			}

			this.$axios({
				url: api.regist,
				method: 'post',
				data: qs.stringify(postData)
			}).then(res => {
				Indicator.close()
				if(res.data.code === 0) {
					Toast('注册成功!')
				}else{
					Toast(res.data.message)
				}
			})

		}
	}
}
</script>

<style lang="scss" scoped>
	@import '../assets/css/common.scss';

	.regist-view{

		header{
			text-align: center;
			padding: rem(100) 0;

			img{
				margin: 0 auto;
				width: rem(180);
			}

			p{
				font-size: rem(35);
				font-weight: bold;
				font-family: normal;
			}
		}

		.regist-win{
			text-align: center;
			p{
				margin-bottom: rem(30);
				position: relative;


				input{
					width: rem(600);
					height: rem(80);
					outline: none;
					border: 1px solid rgba(0,0,0,.36);
					border-radius: rem(10);
					font-size: rem(35);
					text-indent: rem(20);
					margin: 0;
					padding: 0;
					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
					-webkit-appearance:none;
				}

				input:focus{
					border: 1px solid skyblue;
					box-shadow: 0 0 rem(10) skyblue;
				}

				span.btn{
					display: inline-block;
					width: rem(600);
					height: rem(90);
					line-height: rem(90);
					border: 1px solid #2c2c2c;
					outline: none;
					color: #fff;
					font-size: rem(40);
					background: #2c2c2c;
					margin-top: rem(100);
				}
			}

			div.options{
				display: flex;
				padding: 0 rem(80);

				span{
					flex: 1;
					text-align: right;

					a{
						color: rgba(0,0,0,.8);
						font-size: rem(30);
					}
				}

			}
		}

		footer{
			width: 100%;
			position: fixed;
			bottom: rem(50);
			font-family: normal;

			p{
				width: 100%;
				text-align: center;
				font-size: rem(24);
			}
		}

	}
</style>