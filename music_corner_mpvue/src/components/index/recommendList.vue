<template>
  <section class="_recommend_list"> 
      <template v-for="(song, index) in songList" :wx:key="index">
        <div class="song-item" :key="index">
          <div class="item-box">
            <!-- <a :href="'/pages/play/main?songId=' + song.id"></a> -->
            <span class="author-img" :style="{'background-image': 'url('+song.avator+')'}"></span>
            <img @click="pushRoute(song.id, index)" class="song-cover" :src="song.cover" />
            <p class="song-author" v-html="song.author"></p>
            <p class="song-name">{{song.name}}</p>
          </div>
        </div>
      </template>
      <div v-show="isLoading" class="loading-text"><span>加载中...</span></div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import api from '@/api'
export default {
  data () {
    return {
      songList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      isLoadComplete: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions([
      'setCurrentSongInfo'
    ]),
    getRecommendList () {
      this.isLoading = true
      api.listRecommendSongs(this.pageIndex, this.pageSize).then(res => {
        this.isLoading = false
        if (res.data.code === 0) {
          if (res.data.data.list.length) {
            this.isLoadComplete = false
            this.songList = this.pageIndex === 1 ? res.data.data.list : this.songList.concat(res.data.data.list)
            this.total = res.data.data.totalRecord
          } else {
            console.log('load complete!!')
            this.isLoadComplete = true
          }
        }
      }).catch(err => {
        console.log(err)
        this.isLoading = false
      })
    },
    scrollHandler () {
      if (!this.isLoadComplete && !this.isLoading) {
        this.pageIndex++
        this.getRecommendList()
      }
    },
    pushRoute (songId, songIndex) {
      this.setCurrentSongInfo({
        songId: songId,
        songList: this.songList,
        songIndex: songIndex
      })
      let url = '/pages/play/main?songId=' + songId
      wx.navigateTo({url})
    }
  },
  created () {
    this.getRecommendList()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/function.scss';
._recommend_list{
  padding: 20px 0;
  height: 320px;

  .loading-text{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      span{
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
      }
      &:before{
        content: '';
        background-color: #888;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        margin: 2px;
        animation-fill-mode: both;
        border: 2px solid #888;
        border-bottom-color: transparent;
        height: 20px;
        width: 20px;
        background: transparent !important;
        display: inline-block;
        vertical-align: middle;
        animation: rotate 0.75s 0s linear infinite;
        margin-right: 5px;
      }
  }

  .song-item{
    display: inline-block;
    width: 50%;
    text-align: center;
    .item-box{
      width: 140px;
      margin: 0 auto;
      display: inline-block;
      text-align: left;
      margin-bottom: 20px;
      position: relative;
      a{
        @include afterBlock(100%, 100%);
        @include fixLinkBlink;
      }
      span.author-img{
        background-size: cover;
        width: 25px;
        height: 25px;
        display: inline-block;
        position: absolute;
        left: 10px;
        top: 110px;
        border-radius: 50%;
        @include fixLinkBlink;
      }
      img{
        width: 140px;
        height: 140px;
        display: block;
      }
      p{
        width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .song-author{
      color:#888;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
    }
    .song-name{
      color:#000;
      font-size: 16px;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(0.6);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
}
</style>
