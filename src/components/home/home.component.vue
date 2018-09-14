<template>
  <div class="home">
    <div class="home-top">
      <img src="../../assets/images/logo_1.png"/>
      <div class="home-total">
        <p>{{$t("slash.title")}}<span style="font-size: 12px;"></span></p>
        <h2>{{total}}</h2>
      </div>
    </div>
    <div class="language">
			<div :class="{'active':isLang}" @click="onCn()">中文</div>
	    <div :class="{'active':!isLang}"  @click="onEn()">English</div>
      <div class="active chacha" @click="toslash"><img src="../../assets/images/close.png"/></div>
    </div>
    <div class="walletbg"> </div>
    <div class="walletList" :style="listStyle">
      <!-- 刷新按鈕 -->
       <div class="refresh" @click="refresh()"><icon  name="sync-alt" ></icon></div>

      <div class="wallet-item" v-for="item,index in list" @click="toWallet(index)">
        <img src="../../assets/images/remove.png" @click.stop.prenvent="remove(index)"/>
        <p class="accname">{{item.name}}</p>
        <p class="ballabel">{{$t("wallet.balance")}}</p>
        <p class="Balance">{{item.Balance}}</p>
        <!--<p>{{$t("wallet.value")}}</p>-->
        <!--<p>￥{{item.Value}}</p>-->
        <p class="addr">{{item.Address}}</p>
        
      </div>
    </div>

    <div class="warning" v-if="showWarning">
      <form class="warning-toast">
        <div class="pwd-close" @click="closeWarn()">
          <i></i><i></i>
        </div>
        <div class="warning-title">
          <h4>{{$t("home.remove1")}}</h4>
        </div>
        <div class="warning-btn">
          <a @click="removeWallet()">{{$t("home.ok")}}</a>
          <a @click="closeWarn()">{{$t("home.no")}}</a>
        </div>
      </form>
    </div>

    <div class="warning" v-if="showWarning2">
      <form class="warning-toast">
        <div class="pwd-close" @click="closeWarn2()">
          <i></i><i></i>
        </div>
        <div class="warning-title">
          <h4>{{$t("home.remove2")}}</h4>
        </div>
        <div class="warning-btn">
          <a @click="sureRemove()">{{$t("home.ok")}}</a>
          <a @click="closeWarn2()">{{$t("home.no")}}</a>
        </div>
      </form>
    </div>

    
    
    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
    <Loading v-if="showLoading"></Loading>
    <!--<pwd :ciphertext="ciphertext" v-if="showPwd" @showPwd="showPwdVal($event)"></pwd>-->
  </div>
</template>

<script>
  import { Decimal } from 'decimal.js';
  import {BigNumber} from 'bignumber.js';
  import Loading from "../common/loading.component"
  import Toast from "../common/toast.component"
  export default {
    data(){
      return{
      	locale:"en",
      	listStyle:{
            backgroundImage: "url(" + require("../../../static/hua.png") + ")"
       	},
        balance:"",value:"",ciphertext:"",showPwd:false,showLoading:true,
        list:[],addrList:[],total:0,name:[],showToast:false,msg:"",
        isLang: (localStorage.lng=='0')? true: false,
        showWarning:false,showWarning2:false,currentIndex:"",
        

      }
    },
    components:{ Loading,Toast },
    watch: {
	    locale(val) {
	      this.$i18n.locale = val;
	    },
    },
    created(){
      this.init();
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
      refresh(){
        this.init();
      },
      init(){
        this.showLoading=true;
        this.addrList=[];
        
        localStorage.path_name='';
        localStorage.to_path='';
      
      if(localStorage.wallet==undefined){
        this.$router.push('slash');
      }else{
        var datalist=JSON.parse(localStorage.wallet);
        for(let val of datalist){
          (typeof val)!= "object"?val=JSON.parse(val):"";
          (typeof val.ciphertext)!="object"?val.ciphertext=JSON.parse(val.ciphertext):"";
          
          this.addrList.push("0x"+val.ciphertext.address);
          this.name.push(val.name);
        }
        this.getWalletList(this.addrList); 
      }
      },
      remove(index){
        this.showWarning=true;
        this.showWarning2=false;
        this.currentIndex=index;
      },
      removeWallet(){
        this.showWarning=false;
        this.showWarning2=true;
      },
      sureRemove(){
        let index=this.currentIndex;
        this.showWarning2=false;
        this.list.splice(index, 1);
        var datalist=JSON.parse(localStorage.wallet);  
        datalist.splice(index, 1);
        localStorage.wallet=JSON.stringify(datalist);
        if(datalist.length==0){
          localStorage.removeItem('wallet');
          this.$router.push('slash');
        }
      },
      toWallet(index){
        var wallet=JSON.parse(localStorage.wallet);
        let name=wallet[index].name;
        let ciphertext=this.ciphertext=wallet[index].ciphertext;
        let address="0x"+wallet[index].ciphertext.address
        localStorage.address=address;
        localStorage.name=name;
        localStorage.currentWallet=JSON.stringify({"name":name,"ciphertext":ciphertext});
        this.$router.push("wallet");
      },
      getWalletList(addrList){
        this.$axios.post(this.baseUrl+"/wallet/balance",{'address':addrList,"page":1,'count':10}).then((resp)=>{
          // console.log(resp.data);
          this.total=0;
          if(resp.data.code!="0"){
	        	setTimeout(()=>{
	        		this.showLoading=false;
							this.showToast=true; this.msg="common.loadingError";
							return false;
						},1000);
          }
          this.showToast=false;
					let respData =this.list= resp.data.data;
					for(let i in respData){
            console.log(this.total)
						this.total=new Decimal(respData[i].Balance).add(new Decimal(this.total)).toString();
						respData[i].name=this.name[i];
//          respData[i].Balance=respData[i].Balance.replace(/,/g,'');(new BigNumber(respData[i].Balance)).div(ustd_USD).toNumber();
        	}
					setTimeout(()=>{
						this.showLoading=false;
					},10);
					
        }).catch(()=>{
        	this.showLoading=true;
        	setTimeout(()=>{
        		this.showLoading=false;
						this.showToast=true; this.msg="common.loadingError";
					},1000);
        })
      },
      closeWarn(){
        this.showWarning=false;
      },
      closeWarn2(){
        this.showWarning2=false;
      },
      showToastVal(val){//close prompt box
        this.showToast = val;
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
      toslash(){
	      localStorage.to_path=1;
	      this.$router.push("/slash");
	    },
    }
  }
</script>

<style scoped lang="scss">
  @import "home.component";
  @import "../pwd/pwd.component";
</style>
