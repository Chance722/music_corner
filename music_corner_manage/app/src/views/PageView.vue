<template>
	<div class="page-view">
		<app-header :headImg="headImg"></app-header>
		<slide-menu></slide-menu>
		<router-view></router-view>
	</div>
</template>


<script>
import Vue from 'vue'
import api from '../api'
import { mapState,mapMutations } from 'vuex'
import { InfiniteScroll,Indicator } from 'mint-ui'
import SlideMenu from '@/components/SlideMenu'
import AppHeader from '@/components/Header'


export default {
	name: 'page-view',
	data() {
		return {
      headImg: require('../assets/images/default.png')
		}
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
	components: {
		'app-header': AppHeader,
		'slide-menu': SlideMenu
	},
	methods: {
    ...mapMutations([
      'setUserInfo'
    ]),
		getAdminData () {
			this.$axios({
				url: api.getAdminInfo,
				headers: {
					'authorization': localStorage.getItem('userToken') || ''
				}
			}).then(res => {
				if (res.data.code === 0) {
          this.setUserInfo(res.data.data)
					if (this.userInfo && this.userInfo.avator)
						this.headImg = this.userInfo.avator
				} else {
					this.$router.push({
						name: 'login'
					})
				}
			})
		}
	},
	created () {
    this.getAdminData()
    this.$eventhub.$on('UPDATE_USER_INFO', () => {
      this.getAdminData()
    })
	}
}

</script>


<style lang="scss" scoped>

 @import '../assets/css/common.scss';

.index-view{
	

}

</style>