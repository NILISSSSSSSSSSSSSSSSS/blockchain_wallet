<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="pwd-content">
    <form class="pwd-toast">
      <div class="pwd-close" @click="closePwd()">
        <i></i><i></i>
      </div>
      <div class="pwd-input">
        <h4>{{$t("common.openPwdTitle")}}</h4>
        <input type="password" v-model="pwd" v-focus>
      </div>
      <div class="pwd-btn">
        <a @click="openWallet()">{{$t("common.open")}}</a>
      </div>
    </form>
    <toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></toast>
    <Loading v-if="loading"></Loading>
  </div>
</template>
<script>
  import {Encrypt} from "../../assets/js/wallet.js"
  
  import Toast from "../common/toast.component"
  import Loading from "../common/loading.component"
  export default {
    data(){
      return{
        openPwd:"",pwd:"",showToast:false,msg:"",loading:false,
      }
    },
    components:{Toast,Loading},
    props:["ciphertext"],
    methods:{
      openWallet() {
        var _this=this;
        // var Wallet=new MyWallet();
        var encrypt = new Encrypt()
        if(this.pwd ==""){
          this.showToast=true;this.msg="common.pwdNotNull";
        }else{
          this.loading=true;
          this.$axios.post(this.baseUrl + "/wallet/get",{
            itext: encrypt.encode(this.ciphertext),
            ptext: encrypt.encode(this.pwd)
          }).then((res) => {
            this.loading = false
            if(res.data.code == 0){
              var result = res.data.data
              localStorage.address = result.address;
	            _this.$router.push({ name: 'wallet',params:{address:result.address} });
            }else{
              _this.showToast=true; _this.msg="common.pwdError";
            }
          }).catch((err) => {
            this.loading=false;
            this.showToast=true; 
            this.msg="common.openFail";
            return false
          })
//           setTimeout(()=>{
//           	try{
//           		Wallet.decryKeystore(this.ciphertext,this.pwd).then((resp)=>{
// //        			console.log(resp)
// 	              _this.loading=false;
// 	              if(resp!="0"){
// 	                localStorage.address=resp.address;
// //	                localStorage.ciphertext=JSON.stringify(_this.ciphertext);
// 	                _this.$router.push({ name: 'wallet',params:{address:resp.address} });
	                
// 	              }else{
// 	                _this.showToast=true; _this.msg="common.pwdError";
// 	              }
// 	            });
//           	}catch(e){
//           		this.loading=false;
//           		this.showToast=true; 
//           		this.msg="common.openFail";
//           		return false
//           	}
            
//           },200);
        }
      },
      showToastVal(val){
      	this.showToast=false;
      },
      compile(code){//加密
	      var c=String.fromCharCode(code.charCodeAt(0)+code.length);
	      for(var i=1;i<code.length;i++){
	        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
	      }
	      return escape(c);
	    },
      goBack(){
        this.location.back();
      },
      closePwd() {
        this.$emit("showPwd",false);
      }
    },
    directives :{
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
  }
</script>

<style scoped lang="scss">
  @import "pwd.component";
</style>
