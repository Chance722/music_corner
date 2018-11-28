<template>
  <div class="_play_container">
    <play-background></play-background>
  </div>
</template>

<script>
import playBackground from '@/components/play/playBackground'
export default {
  components: {
    playBackground
  },
  data () {
    return {
    }
  }
}
</script>
<style lang='scss' scoped>
._play_container{
  // background: #000;
  height: 100%;
}
</style>