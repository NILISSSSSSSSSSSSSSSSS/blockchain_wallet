<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="footer" :style="footerStyle">
    <div :class="{'active':isLang}" @click="onCn()">中文</div>
    <div :class="{'active':!isLang}"  @click="onEn()">English</div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        locale: "en",
        isLang: localStorage.lng=='0' ? true: false,
        footerStyle:""
      }
    },
    watch:{
    	locale(val) {
	      this.$i18n.locale = val;
	    },
    },
    mounted(){
      if(localStorage.lng=='1'){
        this.locale='en';
      }else {
        this.locale='cn';
      }
      localStorage.lng=(this.locale=='en'?'1':'0');
    },
    methods:{
      getData() {
        this.$axios.get("../static/chinese.json").then(resp => {   })
      },
      onCn() {
        this.isLang=true;
        this.locale='cn';
        localStorage.lng='0';
      },
      onEn() {
        this.isLang=false;
        this.locale='en';
        localStorage.lng='1';
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "lang.component";
</style>
