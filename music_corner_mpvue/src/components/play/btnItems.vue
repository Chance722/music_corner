<template>
  <div class="btn-items-container">
    <div class="btn-item">
      <span class="touch-area" @click="doOperation(operationType.collect, isCollect)">
        <i @animationend="animationEndHandler(operationType.collect)" :class="{'collect-on': isCollect, 'collect-off': !isCollect, 'animate': isCollectAnimate}"></i>
      </span>
    </div>
    <div class="btn-item">
      <span class="touch-area" @click="doOperation(operationType.praise, isPraise)">
        <i :class="{'praise-on': isPraise, 'praise-off': !isPraise, 'clap': isPraiseAnimate}"></i>
      </span>
      <template v-for="(item,index) in isAddOneAnimate">
        <span :key="index" @animationend="animationEndHandler(operationType.praise)" class="add-praise" :class="{'animate': item}">+1</span>
      </template>
    </div>
    <div class="btn-item">
      <span class="touch-area">
        <i class="comment"></i>
      </span>
    </div>
    <div class="btn-item">
      <span class="touch-area">
        <i class="share"></i>
      </span>
    </div>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      isCollect: this.songData.is_collect,
      isPraise: this.songData.is_praise,
      isCollectAnimate: false,
      isPraiseAnimate: false,
      isAddOneAnimate: [],
      operationType: {
        'praise': 1,
        'collect': 2
      }
    }
  },
  props: {
    songData: {
      type: Object
    }
  },
  methods: {
    doOperation (type, value) {
      // 动画中不能进行频繁点击
      if (type === this.operationType['collect'] && this.isCollectAnimate) return
      if (type === this.operationType['praise'] && this.isPraiseAnimate) {
        this.isAddOneAnimate.push(1)
        return
      }

      // type === this.operationType['collect'] ? this.isCollect = !value : this.isPraise = !value
      type === this.operationType['collect'] ? this.isCollect = !value : this.isPraise = true
      if (type === this.operationType['collect']) {
        this.isCollectAnimate = true
      } else if (type === this.operationType['praise'] && !this.isPraiseAnimate) {
        this.isPraiseAnimate = true
        this.isAddOneAnimate.push(1)
        setTimeout(() => {
          this.isPraiseAnimate = false
        }, 300)
      }
      api.doOperation({
        userId: wx.getStorageSync('userId'),
        songId: this.songData.id,
        type: type
      }).then().catch(() => {
        // type === this.operationType['collect'] ? this.isCollect = !this.isCollect : this.isPraise = !this.isPraise
        type === this.operationType['collect'] ? this.isCollect = !this.isCollect : this.isPraise = this.songData.is_praise
      })
    },
    animationEndHandler (type) {
      if (type === this.operationType['collect']) {
        this.isCollectAnimate = false
      } else if (type === this.operationType['praise']) {
        // 在animationend设置 isPraiseAnimate的状态要比原来设置动画的时间300ms长 所以连续点击会有停顿感 所以用setTimeout替代
        // this.isPraiseAnimate = false
        this.isAddOneAnimate = []
      }
    }
  },
  watch: {
    songData (data) {
      this.isCollect = this.songData.is_collect
      this.isPraise = this.songData.is_praise
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-items-container{
  display: flex;
  padding: 20px 30px;

  .btn-item{
    flex: 1;
    position: relative;

    span.add-praise{
      color: #d81e06;
      position: absolute;
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      top: 0;
      right: 10px;
      opacity: 0;
      display: none;
    }
    span.add-praise.animate{
      display: block;
      animation: flowUp .8s ease-in-out;
    }
    span.hide{
      visibility: hidden;
    }
  }
  .btn-item span.touch-area{
    display: inline-block;
    width: 40px;
    height: 40px;
    position: relative;
  }
  .btn-item i{
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -12.5px;
    margin-top: -12.5px;
  }
  i.copy-icon{
    position:absolute;
    left:50%;
    top:0;
    transform:translateX(-50%);
  }
  i.collect-off{
    background-image: url(../../assets/images/collect_off.png);
  }
  i.collect-on{
    background-image: url(../../assets/images/collect_on.png);
  }
  i.clap{
    animation-delay: 0ms;
    animation: clap 300ms 1 running;
  }
  i.animate{
    animation: collect .5s ease-in-out;
  }
  i.praise-off{
    background-image: url(../../assets/images/praise_off.png);
  }
  i.praise-on{
    background-image: url(../../assets/images/praise_on2.png);
  }
  i.comment{
    background-image: url(../../assets/images/comment.png);
  }
  i.share{
    background-image: url(../../assets/images/share.png);
  }

  @keyframes flowUp {
    0%{
      opacity: 0;
      top: 0;
    }
    50%{
      opacity: 1;
      top: -10px;
    }
    100%{
      opacity: 0;
      top: -20px;
    }
  }

  @keyframes collect {
    0%{
      transform: scale(.5);
    }
    50%{
      transform: scale(1.3);
    }
    100%{
      transform: scale(1);
    }
  }
  @keyframes clap {
    0%{
      transform: scale(1);
    }
    50%{
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
}
</style>
