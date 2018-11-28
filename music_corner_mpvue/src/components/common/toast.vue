<template>
  <div :animation="animationData" @transitionend="animationHandler()" class="_component_toast">
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      animationData: {},
      queySelector: wx.createSelectorQuery(),
      animation: wx.createAnimation({
        duration: 800,
        timingFunction: 'linear'
      }),
      totalTransitionTimes: 0,
      currentTransitionTimes: 0
    }
  },
  props: {
    text: {
      type: String,
      default: '你好吗'
    },
    timeout: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    animationHandler () {
      if (!this.text) this.currentTransitionTimes++
      if (!this.text && this.currentTransitionTimes === this.totalTransitionTimes) {
        this.resetToast()
      }
    },
    // 重置toast状态
    resetToast () {
      let animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'linear'
      })
      animation.opacity(0).bottom(0).step()
      this.animationData = animation.export()
    }
  },
  watch: {
    text (text) {
      if (text) {
        this.animation.opacity(1).bottom('20%').step()
        this.animationData = this.animation.export()
        setTimeout(() => {
          this.$emit('close-toast')
        }, this.timeout)
      } else {
        this.animation.opacity(0).bottom('50%').step()
        // 进行了两次transition property设置
        this.totalTransitionTimes = 2
        this.animationData = this.animation.export()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
._component_toast{
  height: 30px;
  line-height: 30px;
  position: fixed;
  background: rgba(0, 0, 0, .7);
  color: #fff;
  font-size: 16px;
  border-radius: 30px;
  padding: 0 15px;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;

  span{
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
