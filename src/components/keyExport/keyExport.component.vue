<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="keyExport">
    <div class="keyExport-contain">
      <div class="close" @click="close()">
        <i></i><i></i>
      </div>
      <div class="keyprivate" >{{ mywallet }}</div>
      <div class="copy">
        <div class="copyYes" v-show="copyYes">{{$t("common.copyYes")}}</div>
        <a v-clipboard:copy="mywallet"
           v-clipboard:success="onCopy"
           v-clipboard:error="onError">
          {{$t("recv.copy")}}
        </a>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    data(){
      return{
        copyYes:false,isCopy:this.isDownload,
      }
    },
    props:["mywallet","isDownload"],
    methods:{
      onCopy(){
        this.copyYes=true;
        setTimeout(()=>{
          this.copyYes=false;
        },800);
        this.isCopy=true;
        // console.log("ok");
      },
      onError(){
        // console.log("failed");
      },
      close(){
        this.$emit("showExport",false);
        this.$emit("isCopy",this.isCopy);
      }

    }
  }
</script>

<style scoped lang="scss">
  @import "keyExport.component";
</style>
