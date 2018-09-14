<template>
  <div class="create">
		<div class="create-contain">
	    <h2>{{$t("create.title1")}}</h2>

	    <form action="" class="pwd-form">
        <div :style="marginStyle">
        	<!-- <p v-if="showUserExist" class="exist">{{$t(userExist)}}</p> -->
          <label >{{$t("create.name")}}</label>
          <input type="text" id="name" v-model="walletName" @focus="showcircle" autocomplete="off">
        </div>
	      <div :style="marginStyle">
	        <label >{{$t("create.label")}}</label>
	        <input type="password" id="pwd1" v-model="pwd" @focus="showcircle">
	      </div>
	      <div :style="marginStyle">
	        <label >{{$t("create.label1")}}</label>
	        <input type="password" id="pwd2" v-model="pwd1" @focus="showcircle">
	      </div>
	      <div class="pwdToast" style="font-size: 10px;color: #FFFFFF;">{{$t("create.pwdLen")}}</div>
	      <a class="btn-create" @click="createWallet()" >{{$t("create.btn")}}</a>
	      
	    </form>
	    
		</div>
		
    <div class="loading-toast" v-if="showLoading">
      <div class="loading" >
        <img src="../../assets/images/4.png" height="334" width="328"/>
        <img src="../../assets/images/3.png" height="330" width="324"/>
        <img src="../../assets/images/2.png" height="334" width="328"/>
        <img src="../../assets/images/1.png" height="330" width="328"/>
      </div>
    </div>
    
    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
  </div>
</template>

<script>

import { Encrypt } from "../../assets/js/wallet"
import Toast from "../common/toast.component"
  export default {
    data(){
      return{
        pwd:"",pwd1:"",showToast:false,msg:"",showLoading:false,
        isMobile:false,walletName:"",showUserExist:false,userExist:"",
        marginStyle:""
      }
    },
    components:{Toast},
    mounted(){
      const screenHeight=window.screen.availHeight;
      const containHeight=document.documentElement.clientHeight;
    	if(screenHeight<850){
    		this.marginStyle={marginBottom:"3rem"}
    	}
    	if(containHeight<screenHeight&&containHeight<525){
        this.marginStyle={marginBottom:"2rem"}
      }
    	/*window.onresize = function(){}*/

      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
        if(screen.availWidth<=1280&&screen.availWidth>=1024){
          this.marginStyle={marginBottom:"2rem"}
        }
      }
    },
    watch:{
    	// walletName(val){
    	// 	if(localStorage.wallet!=undefined){
    	// 		let wallet=JSON.parse(localStorage.wallet);
      //     for(let value of wallet){
      //       if(value.name == val) {
      //         this.showUserExist=true;
			// 				this.userExist="create.walletExist";
			// 				break;
      //       }else{
      //       	this.showUserExist=false;
      //       }
      //     }
    			
    	// 	}
    		
    	// }
    },
    methods:{
      createWallet(){
        var re =new RegExp("^[ ]+$");
      	 
        if( this.walletName==""){
          this.showToast=true;
          this.msg="create.nameNotNull";
          return false
        }
        if(re.test(this.walletName)){
        	this.showToast=true;
          this.msg="create.nameNotNull";
          return false
        }
        // if(this.showUserExist){
        // 	this.showToast=true;
        //   this.msg="create.walletExist";
        //   return false
        // }
        if(this.pwd===""||this.pwd1===""){
          this.showToast=true;
          this.msg="common.pwdNotNull";
          return false;
        }	
        if(this.pwd.length<8){
          this.showToast=true;
          this.msg="create.pwdToast";
          return false;
        }	
         if(this.pwd!==this.pwd1){
          this.showToast=true;
          this.msg="common.pwdNotSame";
          return false;
        } 
        
          this.showLoading=true;

          var encrypt = new Encrypt();
          console.log(encrypt)
          this.$axios.post(this.baseUrl+"/wallet/set",{
            ptext: encrypt.encode(this.pwd)
          }).then((resp) => {
            this.showLoading=false;
            if(resp.data.code == 0){
              // console.log("success")
              let content = resp.data.data.content
              let currentWallet={name:this.walletName,ciphertext:JSON.parse(content)};
                localStorage.name=this.walletName;
                localStorage.address="0x"+JSON.parse(content).address;
                localStorage.currentWallet=JSON.stringify(currentWallet);
                // this.showLoading=false;
                this.$router.push({name: 'download',params:{ciphertext:content}});
            }else{
              // console.log(resp.data.msg[0] || "生成失败")
              let msg = resp.data.msg || "create.createFail"
              this.showToastInfo(msg)
            }
          }).catch((err) => {
            this.showLoading=false;
            let msg =  "create.createFail"
            this.showToastInfo(msg)
            console.log(err)
          })
          // const Wallet=new MyWallet();
          
          // setTimeout(()=>{
          //   Wallet.toKeyStore(Wallet.newAccount(this.pwd),this.pwd).then((resp)=>{
          //     console.timeEnd("start1111")
          //   	let currentWallet={name:this.walletName,ciphertext:JSON.parse(resp)};
          //     localStorage.name=this.walletName;
          //     // console.log(JSON.parse(resp).address)
          //     localStorage.address="0x"+JSON.parse(resp).address;
          //     localStorage.currentWallet=JSON.stringify(currentWallet);
          //     // console.log(JSON.stringify(currentWallet))
              
          //     this.showLoading=false;
	        //     this.$router.push({name: 'download',params:{ciphertext:resp}});
          //  });
          // },100);
      },
      showcircle(){
      	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
				    const height=window.screen.height;
				    this.showLoad=false;
				}
      },
      showToastVal(val){
        this.showToast = val;
      },
      showToastInfo(val) {
        this.showToast = true
        this.msg = val
        setTimeout(() => {
          this.showToast = false
        },2000)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "create.component.scss";
</style>
