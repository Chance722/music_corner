<template>
  <section class="_tab_menu">
    <div class="menu_container">
      <span :class="{'active': index === activeIndex}" v-for="(item, index) in menuList" :key="index">{{item.name}}</span>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      menuList: [
        {
          name: '分类',
          url: 'category'
        }, {
          name: '推荐',
          url: 'index'
        }, {
          name: '我的',
          url: 'me'
        }
      ],
      activeIndex: 1
    }
  }
}
</script>

<style lang="scss" scoped>
._tab_menu{
  width: 100%;
  .menu_container{
    display: flex;
    height: 30px;
    line-height: 30px;
    span{
      flex: 1;
      text-align: center;
      color: #888;
      font-size: 16px;
    }
    span.active{
      font-size: 20px;
      color: #000;
    }
  }
}
</style>
