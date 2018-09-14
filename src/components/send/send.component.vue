<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="send">
    <div class="send-to">
      <div class="send-to-content">
        <div class="send-fee">
          <div>
            <i>{{$t("wallet.balance")}}：{{Balance}} </i>
            <p>{{$t("wallet.fee")}}： 0.01</p>
          </div>
          <div class="saoma" v-if="isMobile">
            <i @click="scan()">{{$t("send.scan")}}</i>
          </div>
        </div>
        <!-- 输入地址 -->
        <div class="send-input">
          <label for="">To</label>
          <input type="text" v-model.trim="to" >
        </div>
        <div class="send-input">
          <label for="">Amount</label>
          <input type="number" v-model="amount">
        </div>
        <a @click="inputPwd()">{{$t("send.generate")}}</a>
      </div>
    </div>

    <div class="send-toast" v-if="showSendToast">
      <div class="send-contain">
        <h3 @click="showTransCode">{{$t(showCode)}}</h3>
        <p v-if="showTransCodeVal">{{allKey}}</p>
        <h4>{{$t("send.sendSPT",{amount:amount})}}
          <span>{{to}}</span>
        </h4>
        <div class="send-btn">
          <h2>{{$t("send.sendNow")}}</h2>
          <img src="../../assets/images/no.png" height="30" width="30" @click="close()" />
          <img src="../../assets/images/ok.png" height="30" width="30" @click="sendTransaction()" />
        </div>
      </div>
    </div>

    <div class="pwd-content" v-if="showPwd">
      <form class="pwd-toast">
        <div class="pwd-close" @click="closePwd()">
          <i></i>
          <i></i>
        </div>
        <div class="pwd-input">
          <h4>{{$t("common.openPwdTitle")}}</h4>
          <input type="password" v-model="pwd" v-focus>
        </div>
        <div class="pwd-btn">
          <a @click="generateTransaction()">{{$t("common.open")}}</a>
        </div>
      </form>
    </div>

    <div class="toast" v-if="sendSuccess">
      <div class="toast-content">
        <div class="toast-close" @click="closeSendSuccess()">
          <i></i>
          <i></i>
        </div>
        <h3>{{$t("send.sendSuccess")}}
          <span class="tradingId">{{msg}}</span>
        </h3>
      </div>
    </div>


    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
    <Loading v-if="loading"></Loading>
  </div>

</template>

<script>
  import { Decimal } from 'decimal.js';
  import { Transaction } from '../../assets/js/transaction'
  import { Encrypt } from "../../assets/js/wallet"
  import Toast from "../common/toast.component.vue"
  import Loading from "../common/loading.component"
  import EthereumTx from 'ethereumjs-tx'
  export default {
    data() {
      return {
        showSendToast: false, showToast: false, msg: "", allKey: "", fee: "", to: "",
        amount: "", loading: false, isSuccess: false, nonce: "", Balance: "",
        showPwd: false, pwd: "", ciphertext: "", isMobile: false, showTransCodeVal: false,
        showCode: "send.viewCode", sendSuccess: false
      }
    },
    components: { Toast, Loading },
    beforeCreate() {

    },
    mounted() {
      if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      this.ciphertext = JSON.stringify(JSON.parse(localStorage.currentWallet).ciphertext);
      this.Balance = localStorage.Balance;
    },
    methods: {
      scan() {//扫一扫
        var _this = this;
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            _this.to = result.text;
            //扫码成功后执行的回调函数
            console.log("收到一个二维码\n" +
              "扫码文字结果: " + result.text + "\n" +
              "格式: " + result.format + "\n" +
              "是否在扫码页面取消扫码: " + result.cancelled);
          },
          function (error) {
            //扫码失败执行的回调函数
            console.log("Scanning failed: " + error);
          }, {
            preferFrontCamera: false, // iOS and Android 设置前置摄像头
            showFlipCameraButton: false, // iOS and Android 显示旋转摄像头按钮
            showTorchButton: true, // iOS and Android 显示打开闪光灯按钮
            torchOn: false, // Android, launch with the torch switched on (if available)打开手电筒
            prompt: "在扫描区域内放置二维码", // Android提示语
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 
            //0 suppresses it entirely, default 1500 设置扫码时间的参数
            formats: "QR_CODE", // 二维码格式可设置多种类型
            orientation: "portrait", // Android only (portrait|landscape), 
            //default unset so it rotates with the device在安卓上 landscape 是横屏状态   
            disableAnimations: true, // iOS     是否禁止动画
            disableSuccessBeep: false // iOS      禁止成功后提示声音 “滴”
          });
      },
      showTransCode() {
        if (this.showTransCodeVal) {
          this.showCode = "send.viewCode";
        } else {
          this.showCode = "send.closeCode";
        }
        this.showTransCodeVal = !this.showTransCodeVal;
      },
      inputPwd() {
        var re = new RegExp("^[ ]+$");
        if (this.to == "" || this.amount == "") {
          this.showToast = true;
          this.msg = "common.notNull";
          return false;
        }
        let value = new Decimal(this.amount).add(0.01).greaterThan(localStorage.Balance);
        if (value) {
          this.showToast = true;
          this.msg = "common.balanceNotEnough";
          return false
        }
        let len = ("" + this.amount).replace(/^\d+\./, '').length;
        if (len > 8) {
          this.showToast = true;
          this.msg = "common.lenToast";
          return false
        }
        this.showPwd = true;
      },
      generateTransaction() {
        var _this = this;
        if (this.pwd == '') {
          this.showToast = true;
          this.msg = "common.pwdNotNull";
          return false
        }
        this.showPwd = false;
        this.loading = true;

        this.$axios.post(this.baseUrl + "/wallet/tradecount", { 'address': localStorage.address }).then((resp) => {
          console.log(resp.data);
          if (resp.data.code == 0 ) {
            this.decryKey(resp.data.data.nonce);
            // console.log("code : 0 true ")
          } else {
            // console.log("code: 0时的false")
            this.loading = false;
            this.showToast = true;
            this.msg = "common.nonceError";
          }
        }).catch((err) => {
          console.log("catch err")
          console.log(err)
          this.loading = false;
          this.showToast = true;
          this.msg = "common.nonceError";
        })
      },
      // 確認交易
      decryKey(nonceData) {//解密钱包
        var _this = this;
        // console.log("进入加密钱包")
        // var Wallet=new MyWallet();
        var encrypt = new Encrypt();
        // console.log(itext)
        let param = 1000000000000000000 * Number(this.amount);
        let money = "0x" + param.toString(16);
        // console.log(this.to)
        // this.to = "" + this.to
        if (this.to.length < 42) {
          this.loading = false;
          this.showToast = true;
          this.msg = "common.lenError";
          return false
        }

        try {
          this.$axios.post(this.baseUrl + "/wallet/get", {
            itext: encrypt.encode(this.ciphertext),
            ptext: encrypt.encode(this.pwd)
          }).then((res) => {
           
            if (res.data.code == 0) {
              var result = res.data.data
              const privateKey = Buffer.from(result.seed, 'hex');
           
              const txParams = {
                nonce: nonceData,
                gas: '0x5208',
                gasPrice: '0x6EDF2A079E',
                to: _this.to,
                value: money,
                //	              data: '0',
              };
             
              const tx = new EthereumTx(txParams);
              tx.sign(privateKey);//所有的交易码
              const serializedTx = this.allKey = tx.serialize().toString('hex');
              this.loading = false;
              this.showSendToast = true;
              return false;
            }else{
              this.loading = false;
              this.showToast = true;
              this.msg = "common.pwdError";
              return false;
            }
          }).catch((err) => {
            this.showToast = true;
            this.loading = false;
            this.msg = "common.sendFailed";
            return false;
          })
        }
        catch(err) {
          console.log("try catch")
          console.log(err)
        }

        // try {
        //   Wallet.decryKeystore(this.ciphertext, this.pwd).then((resp) => {
        //     //      	 	console.log(resp);
        //     if (resp != "0") {
        //       const privateKey = Buffer.from(resp.seed, 'hex');
        //       const txParams = {
        //         nonce: nonceData,
        //         gas: '0x5208',
        //         gasPrice: '0x6EDF2A079E',
        //         to: _this.to,
        //         value: money,
        //         //	              data: '0',
        //       };
        //       const tx = new EthereumTx(txParams);
        //       tx.sign(privateKey);//所有的交易码
        //       const serializedTx = this.allKey = tx.serialize().toString('hex');
        //       this.loading = false;
        //       this.showSendToast = true;
        //     } else {
        //       this.loading = false;
        //       this.showToast = true;
        //       this.msg = "common.pwdError";
        //     }
        //   });
        // } catch (e) {
        //   this.showToast = true;
        //   this.loading = false;
        //   this.msg = "common.sendFailed";
        //   return false;
        // }
      },
      sendTransaction() {
        this.showSendToast = false;
        this.loading = true;
        setTimeout(() => {
          this.$axios.post(this.baseUrl + "/wallet/sendtrade", { 'tradeCode': this.allKey }).then((resp) => {
            console.log(resp.data);
            this.loading = false;
            if (resp.data.code == "0") {
              this.sendSuccess = true;
              this.msg = resp.data.data.result;//insufficient funds
              this.isSuccess = true;
            } else {
              this.showToast = true;
              this.msg = "common.sendFailed";
             
            }
          }).catch(error => {
            this.loading = false;
            this.showToast = true;
            this.msg = "common.sendFailed";
          })
        }, 0)
      },
      closeSendSuccess() {
        this.sendSuccess = false;
        this.$router.push('wallet');
      },
      closePwd() {//关闭输入密码界面
        this.showPwd = false;
      },
      close() {//关闭交易码界面
        this.showSendToast = false;
      },
      showToastVal(val) {
        this.showToast = val;
        if (this.isSuccess) {
          this.$router.push('/wallet');
        }

      },
    },
    directives: {
      focus: {
        inserted(el) {
          el.focus();
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "send.component";
  @import "../pwd/pwd.component";
  @import "../common/toast.component";
  .tradingId {
    font-weight: normal;
  }
</style>