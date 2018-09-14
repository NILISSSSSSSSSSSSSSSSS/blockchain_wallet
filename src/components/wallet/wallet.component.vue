<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="wallet">
    <scroller :on-refresh="refresh" :refreshText="$t('wallet.refreshText')"
        style="margin-top: 5rem;height: 90%;">
      <!-- :on-infinite="infinite" -->
   
      <div class="wallet-contain">
        <div class="address">
          <div class="copyYes" v-show="copyYes">{{$t("common.copyYes")}}</div>
          <h2 v-if="idMobile"><span>{{$t("wallet.address")}}</span><span @click="download">{{$t("wallet.export")}}</span></h2>

          <h2 v-else><span>{{$t("wallet.address")}}</span><span @click="pcDownload()">{{$t("wallet.export")}}</span></h2>
          <p v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">
            {{address}}
          </p>
          <div class="balance">
            <img src="../../assets/images/bgy.png" height="26" width="43"/>
            <p>{{$t("wallet.balance")}}</p>
            <p>{{balance.Balance}}</p>
            <p>≈￥{{balance.Value}}</p>
            <p>{{$t("wallet.value")}}</p>
          </div>
        </div>
        <div class="wallet-btn">
          <div @click="toSend()">
            <img src="../../assets/images/send.png" height="43" width="43"/>
            <p>{{$t("wallet.send")}}</p>
          </div>
          <div @click="toRecv()">
            <img src="../../assets/images/recv.png" height="43" width="43"/>
            <p>{{$t("wallet.recv")}}</p>
          </div>
        </div>
        <div class="records">
          <div>
            <h2>{{$t("wallet.records")}}</h2>
            <p>{{$t("wallet.showRecords")}}</p>
          </div>
          <a :href="commonUrl+'/#/accounts/accountsInfo?address='+address">{{$t("wallet.more")}} ＞</a>
        </div>
        <div class="records-list">
          <a v-for=" item in history" :href="commonUrl+'/#/transactions/transactionsInfo?hash='+item.TxHash" class="records-item">
            <div class="records-item-img">
              <img src="../../assets/images/out.png" height="41" width="41" v-if="item.isOut"/>
              <img src="../../assets/images/in.png" height="41" width="41" v-else/>
            </div>
            <div class="records-item-right">
              <div>
                <h3 v-if="item.isOut">{{$t("wallet.out")}}</h3>
                <h3 v-else>{{$t("wallet.in")}}</h3>
                <p>{{item.TimeStamp}}</p>
              </div>
              <p>{{item.otherAddress}}</p>
              <div class="value">
                <span><label v-if="item.isOut">{{$t("wallet.fee")}}：{{item.Fee}}</label></span>
                <p :class="{inStyle:!item.isOut}">{{item.Value}}</p>
              </div>
            </div>
          </a><!--item-->
          <p v-if="noRrecords">{{$t("wallet.NoTransaction")}}</p>
          
        </div>
      </div>
    </scroller>


    <div class="downLoad-Ways" v-if="showWays">
      <form class="warning-toast">
        <div class="common-close" @click="closeWays()">
          <i></i><i></i>
        </div>
        <div class="warning-btn">
          <a @click="mobileDownload()">{{$t("download.downLoadFile")}}</a>
          <a @click="createAndWriteFile()">{{$t("download.downLoadKeystroe")}}</a>
        </div>
      </form>
    </div>

    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
    <KeyExport :mywallet="wallet" v-if="showExport" @showExport="showExportVal($event)" @isCopy="isCopy($event)"></KeyExport>
  </div>
</template>

<script>
	import { saveAs } from "../../assets/js/FileSaver.js"
	import QrcodeVue from 'qrcode.vue';
  import { BigNumber } from 'bignumber.js';
  import Toast from "../common/toast.component.vue"
  import KeyExport from "../keyExport/keyExport.component"
  import {toBaseUrl} from '../utl.js'
  export default {
    data(){
      return{
        history:[],noRrecords:true,
        address:"",balance:"",isOut:true,showToast:false,msg:"",value:"0",commonUrl:"",
        money:"",ciphertext:"",showExport:false,copyYes:false,wallet:"",walletName:"",
        showWays:false,idMobile:false
      }
    },
    components:{ Toast,KeyExport },
    beforeMount(){
      this.address=localStorage.address;
      this.walletName=localStorage.name;
      this.wallet=localStorage.currentWallet;
      this.ciphertext=JSON.stringify(JSON.parse(localStorage.currentWallet).ciphertext);
      this.walletExsit();
      this.getTransaction();
      this.getBalance();
    },
    mounted(){
    	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
        this.idMobile=true;
      }else{
        this.idMobile=false;
      }
      this.getToBaseUrl();
      console.log(this.filename())
    },
    methods:{
      refresh: function (done) {
        setTimeout(()=>{
          this.getTransaction();
          this.getBalance();
          this.bottom='6rem';
          done();
        },1000)
      },
      infinite(done){
        this.bottom = '5rem';
        done();
      },
      /* 
      * 打开或创建文件夹,创建文件并写入内容 
      * Android:sdcard/xbrother/assets目录 
      * IOS:cdvfile://localhost/persistent/xbrother/assets目录 
      * 文件目录存在则打开,不存在则创建 
      * */ 
      findSameName(subDirEntry){
        var dirReader = subDirEntry.createReader();
        dirReader.readEntries(function(entries){
            for(var i = 0; i < entries.length; i++){
              var entry = entries[i];
              console.log(entry);
            }
          
        })
      },
      createAndWriteFile() {
        var _this=this; 
        
        var walletname=_this.walletName+"-"+_this.address;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) { 
          console.log('打开的文件系统: ' + fs.name);
          fs.root.getDirectory('ACCEdata', {create: true}, function (subDirEntry) {  
            // var fullName=_this.address;
            // var dirReader = subDirEntry.createReader();
            // dirReader.readEntries(function(entries){
            //   console.log("文件长度："+entries.length)
            //   if(entries.length>0){
            //     for(var i = 0; i < entries.length; i++){
            //       var entry = entries[i];
            //       console.log(entry);
            //       var name= entry.name.split("-")[0]; 
            //       if(name==_this.address){
            //         fullName=entry.name
            //       }
            //     }
            //   }
            // })
            
            subDirEntry.getFile(walletname, {create: true, exclusive: false}, function (fileEntry) {
                console.log('entry');
                fileEntry.name == walletname; 
                fileEntry.fullPath == 'ACCEdata/'+walletname;  
                //文件内容  
                var dataObj = new Blob([_this.wallet], {type: 'text/plain'});  
                //写入文件  
                _this.writeFile(fileEntry, dataObj);  
            }, _this.onErrorCreateFile);
          }, _this.onErrorGetDir);  
        }, _this.onErrorLoadFs); 
      },  
      writeFile(fileEntry, dataObj) {  //将内容数据写入到文件中  
        var _this=this;  
          //创建一个写入对象  
          fileEntry.createWriter(function (fileWriter) {  
              //文件写入成功  
              fileWriter.onwriteend = function () {  
                  console.log("Successful file write...");
                  _this.showWays = false;
                  _this.showToast=true;
                  _this.msg="wallet.DownloadSuccess";

              };  
              //文件写入失败  
              fileWriter.onerror = function (e) {  
                  console.log("Failed file write: " + e.toString());  
                  _this.showWays = false;
                  _this.showToast=true;
                  _this.msg="wallet.DownloadFailure";
              };  
              //写入文件  
              fileWriter.write(dataObj);  
          });  
      },
      onErrorGetDir(err){
        console.log("文件夹创建失败！")  ;
        console.log(err)  
      },     
      onErrorLoadFs(error) {   //FileSystem加载失败回调 
          console.log("文件系统加载失败！")  
      },  
      onErrorCreateFile(error) {   //文件创建失败回调
          console.log("文件创建失败！")  
      }, 
      onErrorRemoveFile(){
        console.log("文件删除失败！")  //文件删除失败回调
      },
	    getTransaction(){//获取交易列表
	      this.$axios.post(this.baseUrl+"/wallet/traderecord",{'address':this.address,"page":1,'count':10}).then((resp)=>{
//	         console.log(resp.data);
	        if(resp.data.code=="0"){
	          this.history=resp.data.data;
	          if(this.history.length>0){
	          	this.noRrecords=false;
	          }
            let ustd_USD=1000000000000000000;
	          for(let val of resp.data.data){
//            val.Value=val.Value.replace(/,/g,''); val.Value=(new BigNumber(val.Value)).div(ustd_USD).toNumber();

	            if(this.address==val.FromAddress){
	              val.isOut=true;
	              val.otherAddress=val.ToAddress;
	            }else{
	              val.isOut=false;
	              val.otherAddress=val.FromAddress;
	            }
	          }
	        }else{

	        }
	      }).catch(()=>{
	      	
      	})
      },
      getBalance(){
      	this.$axios.post(this.baseUrl+"/wallet/balance",{'address':localStorage.address}).then((resp)=>{
        // console.log(resp.data);
	        if(resp.data.code=="0"){//new Number(num).toLocaleString()//科学计数法转数值
            this.balance=resp.data.data[0];
            
	          localStorage.Balance=this.balance.Balance;
	        }else{
            localStorage.Balance=this.value=this.balance.Balance="0";
	        }
      	}).catch(()=>{
          localStorage.Balance=this.value=this.balance.Balance="0";
      	})
      },
      download() {//移动端点击拷贝
		    this.showWays=true;
	    },
	    mobileDownload() {//手机备份
        this.showExport=true;
        this.showWays = false;
	    },
      filename(){
        let date = new Date();
        let fileName =this.walletName+"-"+this.address;
        // date.getFullYear() 
        // +"-"+((date.getMonth() + 1)< 10 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1)) 
        // +"-"+(date.getDate()<10?'0'+date.getDate():date.getDate()) 
        // +"="+date.getHours() 
        // +"-"+date.getMinutes() 
        // +"-"+date.getSeconds()
        // +"--"+this.address;
        return fileName
      },
	    pcDownload(){//pc备份
	      var file = new File([this.wallet], this.filename(), { type: "json/plain;charset=utf-8" });
	      saveAs(file);
	    },
      walletExsit(){
        if(!localStorage.address && !localStorage.currentWallet){
          this.$router.push("/slash");
        }
      },
      getToBaseUrl(){
        this.commonUrl = toBaseUrl();
      },
      comomn(money){
        let ustd_USD=1000000000000000000;
        let result=(new BigNumber(money)).div(ustd_USD).toNumber();
        return result;
      },
      toSend() {
        let result=new BigNumber("0x6EDF2A079E").times("0x5208").toNumber();
        if(Number(this.balance.Balance)<=this.comomn(result)){
          this.showToast=true;
          this.msg="common.balanceNotEnough";
        }else{
          this.$router.push('/send');
        }
      },
      onCopy(){
      	this.copyYes=true;
      	setTimeout(()=>{
      		this.copyYes=false;
      	},800)
      },
      onError(){ },
      closeWays() {//关闭下载页面
        this.showWays = false;
      },
      toRecv() {
        this.$router.push('/recv');
      },
      showToastVal(val){
        this.showToast = val;
      },
      showExportVal(val){
      	this.showExport = val;
      },
      isCopy(val){//是否已经复制
	      
	    }
      
    }
  }
</script>

<style scoped lang="scss">
  @import "wallet.component";
  @import "../warning/warning.component";
  .warning-toast{height: 10rem;}
  .warning-btn a{margin-top: 0;padding: 0 0.2rem}
</style>
