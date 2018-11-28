<template>
	<div class="login-view">
		<header>
			<img src="../assets/images/music_logo.png" alt="logo" />
			<p>- Music Corner Management -</p>
		</header>
		<div class="login-win">
			<p><input type="text" ref="nameInput" placeholder="name"></p>
			<p><input type="password" ref="pwdInput" placeholder="password"></p>

		  	<div class="options">
		  		<span class="link"><router-link :to="{name: 'forget'}">忘记密码</router-link></span>
		  		<span class="link"><router-link :to="{name: 'regist'}">注册</router-link></span>
		  	</div>

			<p><span class="btn" @click="login">登录</span></p>
		</div>
		<footer>
			<p>Music Corner &copy; 2018</p>
		</footer>
	</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { Indicator,Toast } from 'mint-ui'
import api from '@/api'
import qs from 'qs'

export default {
	name: 'login-view',
	data () {
		return {}
	},
	methods: {
		login () {
			let name = this.$refs.nameInput.value
			let password = this.$refs.pwdInput.value

			if (!name) {
				this.$refs.nameInput.focus()
				return
			}			
			if (!password) {
				this.$refs.pwdInput.focus()
				return
			}
			if (name && password) {
				Indicator.open()
				let postData = {
						name: name,
						pwd: password
					}
				this.$axios({
					url: api.login,
					method: 'post',
					data: qs.stringify(postData)
				}).then(res => {
					Indicator.close()
					if (res.data.code === 0) {
						let data = res.data.data
            localStorage.setItem('userToken', data.token)
             this.$eventhub.$emit('UPDATE_USER_INFO')
						Toast('登录成功')
						this.$router.push({
							name: 'index'
						})
					} else {
						Toast(res.data.message)
					}
				})
			}

		}
	}
}
</script>

<style lang="scss" scoped>
	@import '../assets/css/common.scss';
	.login-view{
		width: 100%;

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

		.login-win{
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

					a{
						color: rgba(0,0,0,.8);
						font-size: rem(30);
					}
				}

				span:nth-child(1){
					text-align: left;
				}

				span:nth-child(2){
					text-align: right;
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