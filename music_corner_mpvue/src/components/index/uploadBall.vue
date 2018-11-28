<template>
  <div class="_upload_ball">
  </div>
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
._upload_ball{
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #333;
  box-shadow: 0 0 5px 1px #fff;
  bottom: 20px; 
  right: 20px;
  animation: float 1.5s ease-in-out infinite alternate;

  &:after{
    content: '';
    display: inline-block;
    background: rgba(0,0,0,1);
    position: fixed;
    width: 28px;
    height: 12px;
    border-radius: 50%;
    bottom: 10px;
    right: 44px;
    transform: translateX(50%);
    transform-origin: center center;
    animation: shadow 1.5s ease-in-out infinite alternate;
  }

  @keyframes float{
    from{
      bottom: 20px;
    }
    to{
      bottom: 35px;
    }
  }
  @keyframes shadow{
    from{
      width: 28px;
      height: 12px;
      background: rgba(0,0,0,1);
    }
    to{
      width: 14px;
      height: 8px;
      background: rgba(0,0,0,.6);
    }
  }
}
</style>
