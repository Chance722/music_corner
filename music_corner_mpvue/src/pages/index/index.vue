<template>
  <div class="_index__container">
    <scroll-view scroll-y="true" @scrolltolower="scrollHandler">
      <search-bar></search-bar>
      <tab-menu></tab-menu>
      <banner></banner>
      <recommend-list></recommend-list>
      <upload-ball></upload-ball>
    </scroll-view>
  </div>
</template>

<script>
import api from '@/api'
import searchBar from '@/components/index/searchBar'
import tabMenu from '@/components/index/tabMenu'
import banner from '@/components/index/banner'
import recommendList from '@/components/index/recommendList'
import uploadBall from '@/components/index/uploadBall'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },

  components: {
    searchBar,
    tabMenu,
    banner,
    recommendList,
    uploadBall
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  methods: {
    ...mapActions([
      'setUserInfo'
    ]),
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res)
          if (res.code) {
            wx.getUserInfo({
              widthCredentials: true,
              success: resUser => {
                api.login(res.code, resUser.encryptedData, resUser.iv).then(result => {
                  // this.userInfo = result.data.data
                  this.setUserInfo({
                    userInfo: result.data.data
                  })
                  if (result.data.code === 0) {
                    wx.setStorageSync('openId', result.data.data.openid)
                    wx.setStorageSync('userId', result.data.data.userid)
                  }
                })
              }
            })
          }
        }
      })
    },
    scrollHandler () {
      console.log('???')
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped lang='scss'>
._index__container{
  height: 100%;
}
</style>
