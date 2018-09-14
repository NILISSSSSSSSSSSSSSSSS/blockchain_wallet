<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="keyImport">
    <div class="keyImport-contain">
      <div class="keyprivate"  id="keyprivate" v-model="wallet" @input="wallet=$event.target.innerHTML" contenteditable="true" placeholder="key private">
      </div>
      <!-- 开始导入按钮 -->
      <a @click="showInputPwd()" :style="btnStyle">{{$t("keyimport.import")}}</a>
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
          <a @click="importWallet()">{{$t("common.open")}}</a>
        </div>
      </form>
    </div>

    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
    <Loading v-if="loading"></Loading>
  </div>

</template>

<script>
  import { Encrypt } from "../../assets/js/wallet"
  import Toast from "../common/toast.component"
  import Loading from "../common/loading.component"
  export default {
    data() {
      return {
        ciphertext: "", pwd: "", btnStyle: "", isNotEmpty: false, showPwd: false,
        showToast: false, msg: "", loading: false, wallet: ""
      }
    },
    components: { Toast, Loading },
    watch: {
      wallet(val) {
        this.color(val);
      }
    },
    mounted() {
    },
    methods: {
      showInputPwd() {
        // 相同钱包不允许导入
       if (this.wallet !== "") {
          if(this.isSimilarWallet(JSON.parse(this.wallet))=="similarName"){
             this.showToast=true; this.msg="common.haveSimilarName";
              return;
          }
          else if(this.isSimilarWallet(JSON.parse(this.wallet))=="similarAddress"){
            this.showToast=true; this.msg="common.haveSimilarWallet";
            return;
          }
          else{
            this.showPwd = true;
          }

        } else {
          this.showToast = true; this.msg = "common.notNull";
          return false
        }
      },
      color(key) {//按钮背景色
        if (key !== "") {
          this.isNotEmpty = true;
          this.btnStyle = { background: "#EC4B4B" };
        } else {
          this.isNotEmpty = false;
          this.btnStyle = "";
        }
      },
      importWallet() {//打开钱包
        var _this = this;
        if (this.pwd == "") {
          this.showToast = true;
          this.msg = "common.pwdNotNull";
          return false
        }
        this.showPwd = false;
        this.loading = true;
        // var Wallet=new MyWallet();
        var encrypt = new Encrypt();

        this.ciphertext = JSON.parse(this.wallet).ciphertext;
        console.log(JSON.parse(this.wallet))
        console.log(this.ciphertext)
        this.$axios.post(this.baseUrl + "/wallet/get", {
          itext: encrypt.encode(JSON.stringify(this.ciphertext)),
          ptext: encrypt.encode(this.pwd)
        }).then((res) => {
          _this.loading = false;

          if (res.data.code == 0) {
            let result = res.data.data

            localStorage.address = result.address;
            localStorage.currentWallet = _this.wallet;//当前钱包
            localStorage.name=JSON.parse(_this.wallet).name

            if (localStorage.wallet != undefined) {
              var wallet = JSON.parse(localStorage.wallet);
              if (wallet instanceof Array) {
                let flag = false;
                for (var i = 0; i < wallet.length; i++) {
                  if (wallet[i].name == JSON.parse(_this.wallet).name) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  wallet.push(JSON.parse(_this.wallet));
                  localStorage.wallet = JSON.stringify(wallet);
                }
              } else {
                var temp = [];
                  temp[0] = wallet;
                  temp.push(_this.wallet);
                  localStorage.wallet = JSON.stringify(temp);
              }
            } else {
              var arr = [];
              arr[0] = JSON.parse(_this.wallet);
              localStorage.wallet = JSON.stringify(arr);
            }
            _this.$router.push({ name: 'wallet', params: { address: result.address } });
          } else {
            _this.showToast = true; _this.msg = "common.pwdKeyError";
          }
        }).catch((err) => {
          this.loading = false;
          this.showToast = true; _this.msg = "keyimport.importError";
          return false;
        })
        // setTimeout(() => {
        //   try {
        //     _this.ciphertext = JSON.parse(_this.wallet).ciphertext;
        //     Wallet.decryKeystore(_this.ciphertext, _this.pwd).then((resp) => {
        //       _this.loading = false;
        //       if (resp !== 0) {
        //         localStorage.address = resp.address;
        //         localStorage.currentWallet = _this.wallet;//当前钱包

        //         if (localStorage.wallet != undefined) {
        //           var wallet = JSON.parse(localStorage.wallet);
        //           if (wallet instanceof Array) {
        //             let flag = false;
        //             for (var i = 0; i < wallet.length; i++) {
        //               if (wallet[i].name == JSON.parse(_this.wallet).name) {
        //                 flag = true;
        //                 break;
        //               }
        //             }
        //             if (!flag) {
        //               wallet.push(JSON.parse(_this.wallet));
        //               localStorage.wallet = JSON.stringify(wallet);
        //             }
        //           } else {
        //             var temp = [];
        //             if (wallet.name != _this.wallet.name) {
        //               temp[0] = wallet;
        //               temp.push(_this.wallet);
        //               localStorage.wallet = JSON.stringify(temp);
        //             }
        //           }
        //         } else {
        //           var arr = [];
        //           arr[0] = JSON.parse(_this.wallet);
        //           localStorage.wallet = JSON.stringify(arr);
        //         }
        //         _this.$router.push({ name: 'wallet', params: { address: resp.address } });
        //       } else {
        //         _this.showToast = true; _this.msg = "common.pwdKeyError";
        //       }
        //     });
        //   } catch (e) {
        //     this.loading = false;
        //     this.showToast = true; _this.msg = "keyimport.importError";
        //     return false;
        //   }

        // }, 10);
      },
      showToastVal(val) {//关闭toast界面
        this.showToast = val;
      },
      closePwd() {//关闭输入密码界面
        this.showPwd = false;
      },
      compile(code) {//加密
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
      }

    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "keyImport.component";
  @import "../pwd/pwd.component";
</style>