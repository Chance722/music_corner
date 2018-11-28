<template>
	<div class="progress-bar">
		<span class="time-sp"><span class="start-time">{{currentTime}}</span></span>
		<!-- <span class="bar-sp">
			<div class="scroll-bar">
				<div class="buffer-track"></div>
				<div :style="{'width': trackWidth}" class="current-track"></div>
			</div>
			<input @touchstart="inputTouchStart" @touchend="inputTouchEnd" v-model="progressValue" type="range" min="0" max="100" value="0" class="play-bar" />
		</span> -->
    <span class="bar-sp">
      <slider @changing="changingHandler($event)" @change="changeHandler($event)" block-size="12" :value="progressValue" step="0.01" backgroundColor="rgba(227, 221, 216,.6)" activeColor="#fff" min="0" max="100" />
    </span>
		<span class="time-sp"><span class="end-time">{{duration}}</span></span>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      progressValue: 0,
      isChanging: false,
      isCanPlay: false,
      audioData: null
    }
  },
  props: {
    isPlaying: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      innerAudioContext: state => state.innerAudioContext // audio实例
    }),
    currentTime () {
      if (this.audioData) {
        return this.formatTime(this.audioData.currentTime)
      }
      return '00:00'
    },
    duration () {
      if (this.audioData) {
        return this.formatTime(this.audioData.duration)
      }
      return '00:00'
    },
    trackWidth () {
      return Number(this.progressValue) + '%'
    }
  },
  watch: {
    audioData (data) {
      if (this.isChanging) {
        return
      }
      if (data.currentTime && data.duration) {
        this.progressValue = (data.currentTime / data.duration * 100).toFixed(2)
      } else {
        this.progressValue = 0
      }
    }
  },
  methods: {
    ...mapMutations([
      'setInnerAudioContext'
    ]),
    formatTime (value) {
      if (!value) return '00:00'
      var length = Math.floor(parseInt(value))
      var minute = Math.floor(value / 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      var second = length % 60
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    changeHandler (e) {
      let position = this.innerAudioContext.duration * (Number(e.mp.detail.value) / 100)
      this.innerAudioContext.seek(position)
      this.isChanging = false
    },
    changingHandler (e) {
      this.progressValue = e.mp.detail.value
      this.isChanging = true
    },
    initAudioEvents () {
      if (this.innerAudioContext) {
        this.innerAudioContext.onCanplay(() => {
          this.isCanPlay = true
        })
        this.innerAudioContext.onWaiting(() => {
          this.isCanPlay = false
        })
        this.innerAudioContext.onSeeking(() => {
          this.innerAudioContext.pause()
        })
        this.innerAudioContext.onSeeked(() => {
          this.innerAudioContext.play()
          if (!this.isPlaying) {
            this.innerAudioContext.pause()
          }
        })
        this.innerAudioContext.onTimeUpdate(() => {
          if (this.isCanPlay) {
            this.audioData = {
              currentTime: this.innerAudioContext.currentTime,
              duration: this.innerAudioContext.duration
            }
          }
        })
      }
    }
  },
  onLoad () {
    this.initAudioEvents()
  }
}
</script>

<style lang="scss" scoped>
.progress-bar{
	width: 100%;
	position: relative;
	height: 30px;
	display: flex;
  margin-bottom: 10px;

  slider{
    margin: 5px 18px;
  }

	span.time-sp{
		display: inline-block;
		line-height: 30px;
		flex: 1.5;
		position: relative;
		text-align: center;
		color: #fff;
    font-size: 16px;

		span{
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			display: inline-block;
			z-index: 100;
		}
    span.start-time{
      left: 5px;
    }
    span.end-time{
      right: 5px;
    }
	}
	span.bar-sp{
		line-height: 30px;
		flex: 7;
		position: relative;
	}
}
</style>
