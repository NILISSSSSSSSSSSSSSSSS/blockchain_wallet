<template>
    <div class="loading">
      <div class="loading-contain">
        <span class="loading-circle"></span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "loading"
    }
</script>

<style scoped lang="scss">

  .loading{
    width: 100%;height: 100%;position: fixed;top: 0;left:0;z-index:9;background: rgba(0,0,0,0.3);
    display: flex;justify-content: center;align-items: center ;
  }
  .loading-contain{
    width: 30%;height: 6rem;background: rgba(0,0,0,0.7);border-radius: 5px;position: relative;
    display: flex;justify-content: center;align-items: center ;
  }
  .loading-circle{
    display: inline-block;
    height: 15px;width: 15px;
    border-radius: 100%; margin: 0 6px;
    border: 2px solid #CCCCCC;
    border-bottom-color: transparent;
    vertical-align: middle;
    -webkit-animation: rotate 0.75s linear infinite;
    animation: rotate 0.75s linear infinite;
    -webkit-animation: rotate 0.75s linear infinite;
    animation: rotate 0.75s linear infinite;
  }
  @-webkit-keyframes rotate {
    0% { -webkit-transform: rotate(0deg); }
    50% {  -webkit-transform: rotate(180deg); }
    100% {  -webkit-transform: rotate(360deg);}
  }
  @keyframes rotate {
    0% { transform: rotate(0deg);  }
    50% { transform: rotate(180deg);}
    100% {transform: rotate(360deg);}
  }
  @media screen  and (min-width: 768px){
    .loading-contain{width: 220px;height: 160px;}
  }
</style>
