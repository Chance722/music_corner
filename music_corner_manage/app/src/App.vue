<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,body{
  height: 100%;
}
body {
  font-family:"Microsoft Yahei",Arial,"微软雅黑";
}
#app {
  width: 100%;
  min-width: 320px;
  margin: 0 auto;
  min-height: 100%;
  position: relative;
}
</style>
