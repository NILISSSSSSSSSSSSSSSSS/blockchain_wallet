<template>
  <div class="iframeBox">
      <iframe src="../../static/ios/a.html"   width="100%"
      height="800"
      frameborder='0'>
      
      </iframe>
  </div>
</template>
<style scoped>
  #app>div:last-child.iframeBox{
    width: 100%;
    height: 100%;
    overflow: auto;
    /* overflow-x: hidden; */
  }
  .wallet-close[data-v-3e20cfce] {
   
    background: transparent;

}
</style>
<script>
  export default{
    mounted(){
      // document.getElementsByClassName("iframeBox")[0].style.height=(document.body.clientHeight-60)+"px"
    }
  }
</script>