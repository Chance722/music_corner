<template>
  <div class="_play_background" v-if="isDataReady" :class="{'empty-bg': noData}" :style="{'background-image': 'url('+songData.cover+')'}">
    <div class="glass-cover"></div>
    <div class="black-cover"></div>
    <!--needle part-->
    <div class="needle-wrapper">
      <span class="needle-support"></span>
      <img class="needle" :src='needleImage' :class="{'playing': isPlaying}">
    </div>
    <!--disk part-->
    <div class="disk-bg" :class="{'playing': isPlaying}">
      <img class="disk" :src='discImage'>
      <img class="cover" :src='songData.cover'>
    </div>
    <div class="disk-play-btn" @click="updatePlayer(false)" :class="{'isShow': !isPlaying}">
      <span class="play-btn"></span>
    </div>
    <!--button part-->
    <div class="bottom-panel">
      <btn-items :songData="songData"></btn-items>
      <progress-bar :isPlaying="isPlaying"></progress-bar>
      <button class="last-btn" @click="updateSongIndex('prev')"></button>
      <button @click="updatePlayer(isPlaying)" :class="{'pause-btn': isPlaying, 'play-btn': !isPlaying}"></button>
      <button class="next-btn" @click="updateSongIndex('next')"></button>
    </div>
    <toast :text="tips" @close-toast="tips = ''"></toast>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import discImage from '@/assets/images/disc-wrap.png'
import needleImage from '@/assets/images/needle.png'
import progressBar from './progressBar'
import btnItems from './btnItems'
import Toast from '@/components/common/toast'
import api from '@/api'
export default {
  components: {
    progressBar,
    btnItems,
    Toast
  },
  data () {
    return {
      discImage,
      needleImage,
      isPlaying: false,
      songData: {},
      tips: '',
      noData: false
    }
  },
  computed: {
    ...mapState({
      innerAudioContext: state => state.innerAudioContext, // audio实例
      currentSongInfo: state => state.currentSongInfo
    }),
    isDataReady () {
      return !!Object.keys(this.songData).length
    }
  },
  methods: {
    ...mapActions([
      'setCurrentSongInfo'
    ]),
    ...mapMutations([
      'setInnerAudioContext'
    ]),
    getSongsData (songId) {
      api.getSongById(songId).then(res => {
        if (res.data.code === 0) {
          this.noData = false
          this.songData = res.data.data
          this.innerAudioContext.src = this.songData.qiniu_url
        } else {
          this.noData = true
          this.tips = '获取歌曲信息失败'
        }
      })
    },
    initPlayer () {
      this.setInnerAudioContext(wx.createInnerAudioContext())
      this.innerAudioContext.autoplay = true
      this.innerAudioContext.src = this.songData.qiniu_url
      this.innerAudioContext.onPlay(() => {
        this.isPlaying = true
      })
      this.innerAudioContext.onPause(() => {
        this.isPlaying = false
      })
      this.innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    },
    updateSong () {
      this.innerAudioContext.src = this.songData.qiniu_url
    },
    updateSongIndex (type) {
      let updateIndex
      let songIndex = this.currentSongInfo.songIndex
      let songList = this.currentSongInfo.songList
      if (type === 'prev') {
        updateIndex = songIndex === 0 ? songList.length - 1 : songIndex - 1
      } else if (type === 'next') {
        updateIndex = songIndex === songList.length - 1 ? 0 : songIndex + 1
      }
      let songId = songList[updateIndex]['id']
      this.setCurrentSongInfo({
        songId: songId,
        songList: songList,
        songIndex: updateIndex
      })
      this.getSongsData(songId)
    },
    updatePlayer (isPlaying) {
      if (isPlaying) {
        this.innerAudioContext.pause()
      } else {
        this.innerAudioContext.play()
      }
    }
  },
  onLoad () {
    let songId = this.currentSongInfo.songId
    this.initPlayer()
    this.getSongsData(songId)
  },
  onUnload () {
    this.innerAudioContext.destroy()
    this.songData = {}
  }
}
</script>

<style lang="scss" scoped>
._play_background{
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .2);

  .glass-cover{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;  
    filter: blur(10px);   
  }
  .black-cover{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .5);  
  }

  .needle-wrapper{
    .needle-support{
      width: 40px;
      height: 20px;
      position: absolute;
      display: inline-block;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      background-image: url('../../assets/images/needle-cover.png');
      background-size: 100% 100%;
      z-index: 100;
    }
    img.needle{
      width: 84px;
      height: 136px;
      position: absolute;
      transition: all 1s;
		  transform-origin: 14% 0;
      transform: translate(-5px, -5px) rotate(-30deg);
      left: 50%;
      top: 0;
      z-index: 99;
    }
    img.needle.playing{
      transform: translate(-5px, -5px) rotate(0deg);
    }
  }

  .disk-bg,.disk-play-btn{
    width: 280px;
    height: 280px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 70px) rotate(0deg);
    z-index: 98;
  }
  .disk-bg{
    animation: play 10s linear infinite;
    animation-play-state: paused;
    img.disk{
      width: 100%;
      height: 100%;
    }
    img.cover{
      width: 180px;
      height: 180px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
  }
  .disk-play-btn{
    z-index: 99;
    .play-btn{
      width: 70px;
      height: 70px;
      display: inline-block;
      position: absolute;
      left: 50%;
      top: 50%;
      opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity ease-in-out .3s;
      pointer-events: none;
      background: {
        image: url(../../assets/images/music_disk_play.png);
        size: 100% 100%;
      }
    }
  }
  .disk-play-btn.isShow .play-btn{
    opacity: 1;
    pointer-events: auto;
  }
  .disk-bg.playing{
    animation-play-state: running;
  }

  .bottom-panel{
    text-align: center;
    position: fixed;
    bottom: 50px;
    width: 100%;
    button{
      display: inline-block;
      vertical-align: middle;
      border: none;
      outline: none;
      background: rgba(0, 0, 0, 0);
      background-size: 100% 100%;
      border-radius: 50%;
    }

    .play-btn,.pause-btn{
      width: 65px;
      height: 65px;
      margin: 0 30px;
    }

    .play-btn{
      background-image: url(../../assets/images/play_icon.png);
    }

    .pause-btn{
      background-image: url(../../assets/images/pause_icon.png);
    }

    .last-btn,.next-btn{
      width: 50px;
      height: 50px;
      background-image: url(../../assets/images/next_icon.png);
    }
    .last-btn{ 
      transform: rotate(180deg);
    }
  }
  @keyframes play {
    from {
      transform: translate(-50%, 70px) rotate(0deg);
    }
    to {
      transform: translate(-50%, 70px) rotate(360deg);
    }
  }
}
._play_background.empty-bg{
  background-color: #cdcdcd;
}
</style>
