<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="wallet-close" >
    <img @click="goBack()" src="../../assets/images/close.png"/>
    <h5>{{$t(title+".title")}}</h5>
  </div>
</template>

<script>
  export default {
    props:["title"],
    methods:{
      goBack(){
        history.go(-1);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "close.component";
</style>
