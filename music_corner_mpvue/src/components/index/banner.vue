<template>
  <section class="_banner">
    <swiper class="swiper" indicator-dots="true" indicator-color="rgba(255, 255, 255, .6)" indicator-active-color="#fff" autoplay="true" interval="3000" duration="1000">
      <block v-for="(item, index) in movies" :index="index" :key="index">
          <swiper-item>
              <image :src="item" class="slide-image" mode="aspectFill"/>
          </swiper-item>
      </block>
    </swiper>
  </section>
</template>

<script>
export default {
  data () {
    return {
      movies: []
    }
  },
  mounted () {
    this.movies = [
      require('../../assets/images/banner1.jpg'),
      require('../../assets/images/banner2.jpg')
    ]
  }
}
</script>

<style lang="scss" scoped>
._banner{
  padding: 10px 0;
}
.swiper{
  width: 90%;
  margin: 0 auto;
  height: 120px;
  border-radius: 10px;
  image{
    width: 100%;
    height: 100%;
    border-radius: 3px;
  }
}
</style>
