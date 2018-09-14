<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="recv">
    <div class="recv-content">
      <div class="recv-code" ref="code">
        <qrcode-vue :value="account" :size="size" level="H"></qrcode-vue>
      </div>
      <div class="recv-address">
        <p ref="address">
          {{account}}
        </p>
      </div>
      <div class="recv-copy">
      	<div class="copyYes" v-show="copyYes">{{$t("common.copyYes")}}</div>
        <a v-clipboard:copy="account"
           v-clipboard:success="onCopy"
           v-clipboard:error="onError">
           {{$t("recv.copy")}}
        </a>

      </div>
    </div>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  export default {
    data(){
      return{
        account:localStorage.address,size:"200",copyYes:false
      }
    },
    components: { QrcodeVue },
    beforeMount(){
      this.account=localStorage.address;
    },
    mounted(){
      this.size=this.$refs.code.offsetWidth-2;
    },
    // components:{Close1},
    methods:{
      onCopy(){
       
        this.copyYes=true;
     
      	setTimeout(()=>{
      		this.copyYes=false;
      	},800)
//      console.log("ok");
      },
      onError(){
//      console.log("failed");
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "recv.component";
</style>

