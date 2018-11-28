<template>
  <section class="_search_bar">
    <div class="search_input_container">
      <i class="search-icon"></i>
      <input cursor="50" >
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/function.scss';
._search_bar{
  height: 50px;

  .search_input_container{
    padding: 5px 20px;
    position: relative;
    i.search-icon{
      width: 26px;
      height: 26px;
      display: inline-block;
      position: absolute;
      left: 25px;
      top: 10px;
      @include autoBackground('../../assets/images/search_icon.png');
    }
    input{
      width: 88%;
      height: 34px;
      margin: 0 auto;
      border: 1px solid #e7e7e7;
      border-radius: 4px;
      box-shadow: 0 0 5px 1px rgba(231, 231, 231, .75);
      transition: border linear .2s, box-shadow linear .5s;
      font-size: 16px;
      color: #888;
      padding-left: 12%;
    }
  }
}
</style>
