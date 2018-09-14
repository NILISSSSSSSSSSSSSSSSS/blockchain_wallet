<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="wallet-close" :style="closeStyle">
    <img @click="goBack()" src="../../assets/images/close1.png"/>
    <h5 :style="h5Style" v-if="!isName">{{$t(title+".title")}}</h5>
    <h5 :style="h5Style" v-if="isName">{{title}}</h5>
  </div>
</template>


<script>
  export default {
    data(){
      return{
        h5Style:"",closeStyle:"",isName:true
      }
    },
    props:["title"],
    mounted(){
    	this.color(localStorage.path_name);
    	let val=localStorage.path_name;
    	if(val=="send"||val=="recv"||val=="keyimport"){
      	this.isName=false;
      }else{
      	this.isName=true;
      }
    },
    watch:{
      $route(to, from) {
        this.color(to.path.substring(1));
        let val=to.path.substring(1);
        
	    	if(val=="send"||val=="recv"||val=="keyimport"){
	      	this.isName=false;
	      }else{
	      	this.isName=true;
	      }
        
      }
    },
    methods:{
      goBack(){
        if(this.$route.path=="/wallet"){
          this.$router.push("/");
        }else{
          history.go(-1);
        }
      },
      color(val){
        if (val=="send"||val=="recv"||val=="keyimport") {
          this.closeStyle={background:"#fafafa",height:"7rem",};
          this.h5Style={color:"#E3A33D",padding:"1.5rem 0 0.3rem",borderBottom:" 2px solid #E3A33D"};
        }else{
          this.h5Style="";
          this.closeStyle="";
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "close1.component";
</style>
