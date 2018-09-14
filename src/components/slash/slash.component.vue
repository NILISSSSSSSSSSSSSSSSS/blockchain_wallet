<template>
  <div class="slash">
    <img src="../../assets/images/logo.png" :style="imgStyle" />
    <div class="slash-title">
      <h1>{{$t("slash.tip")}}
        <span style="font-size: 12px;"></span>
      </h1>
      <h2 :style="titleStyle">{{$t("slash.title1")}}</h2>
      <div class="shortLine"></div>
    </div>

    <div class="btn-content" :style="btnStyle">
      <router-link to="/create" class="createNew" :style="marginStyle">{{$t("slash.createWallet")}}</router-link>
      <div class="line" :style="orStyle">
        <img src="../../assets/images/line 1.png" height="3" width="45%" />
        <span>{{$t("slash.or")}}</span>
        <img src="../../assets/images/line 1.png" height="3" width="45%" />
      </div>
      <!-- 移动端导入文件 -->
      <!-- //用秘钥打开钱包 -->
      <a class="openOther" :style="marginStyle" v-if="isMobile" @click="mobileOpen">{{$t("slash.openWallet0")}}</a>
      <label class="openOther" :style="marginStyle" v-if="isMobile">
        <input v-if="!isIOS" type="file" @change="mobileOpenFile($event)" ref="filepath">
         <!-- 安卓的的从秘钥文件打开钱包 -->
        <a v-if="!isIOS">{{$t("slash.openWallet")}}</a>
        <!-- ios的从秘钥文件打开钱包 -->
        <a class="openOther" v-if="isIOS" @click="getAndReadFile()" ref="filepath">{{$t("slash.openWallet")}}</a>
      </label>

      <!-- pc导入文件 -->
      <label class="openOther" v-if="!isMobile" :style="marginStyle">
        <input type="file" @change="pcOpen($event)" ref="filepath">
        <a>{{$t("slash.openWallet")}}</a>
      </label>
    </div>
    <!-- 請輸入密碼打開 -->
    <div class="pwd-content" v-if="showPwd">
      <form class="pwd-toast">
        <div class="pwd-close" @click="closePwd()">
          <i></i>
          <i></i>
        </div>
        <div class="pwd-input">
          <h4>{{$t("common.openPwdTitle")}}</h4>
          <input type="password" v-model="openPwd" v-focus>
        </div>
        <div class="pwd-btn">
          <a @click="openWallet()">{{$t("common.open")}}</a>
        </div>
      </form>
    </div>
    <!--ios列表展示-->
    <file-list v-if="hasFile" :fileList="fileList" @closFileList="closFileList($event)"></file-list>
    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></Toast>
    <Loading v-if="loading"></Loading>
    <Lang></Lang>
  </div>
</template>

<script>
  import { Encrypt } from "../../assets/js/wallet"
  import Lang from "../common/lang.component"
  import Toast from "../common/toast.component"
  import Loading from "../common/loading.component"
  import FileList from "../common/fileList"
  export default {
    data() {
      return {
        btnStyle: {
          backgroundImage: "url(" + require("../../../static/hua.png") + ")"
        },
        showPwd: false, openPwd: "", imgStyle: "", marginStyle: "",
        showToast: false, msg: "", ciphertext: "", loading: false, isMobile: false,
        objStyle: {}, wallet: "", titleStyle: "", orStyle: "", hasFile: false,
        isIOS: false, fileList: [{ 'name': 'a', "address": "ahdukshfkstrhtikrnkfhiurbgk" }, { 'name': 'a', "address": "ahdukshfkstrhtikrnkfhiurbgk" }]
      }
    },
    components: { Lang, Toast, Loading, FileList },
    created() {
      this.styleChang();
      if (localStorage.wallet == undefined) {
        localStorage.to_path = "";
      }

    },
    mounted() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ios移动端
        this.isIOS = true;
        this.isMobile = true;
        this.btnStyle.height = "13.6rem";
        this.orStyle = { display: "none" };
        this.titleStyle = { fontSize: "1.2rem", lineHeight: "1.8rem" };
      } else if (/(Android)/i.test(navigator.userAgent)) { //Android移动端
        this.isMobile = true;
        this.btnStyle.height = "13.6rem";
        this.orStyle = { display: "none" };
        this.titleStyle = { fontSize: "1.2rem", lineHeight: "1.8rem" };
      } else {
        this.isMobile = false;
      }
    },
    methods: {
      styleChang() {
        const screenHeight = window.screen.availHeight;
        if (screenHeight < 850) {
          document.documentElement.style.fontSize = "14px"
          this.btnStyle.height = '12rem';
          this.marginStyle = { marginBottom: '1rem' };
          this.imgStyle = { height: "8rem", width: '8rem' };
        }
      },
      mobileOpen() {
        this.$router.push("keyimport");
      },
      //ios打開
      getAndReadFile() {
        var _this = this;
        console.log('进入文件读取系统')
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          console.log('打开的文件系统: ' + fs.name);
          fs.root.getDirectory('ACCEdata', { create: true }, function (subDirEntry) {
            console.log('进了');
            var dirReader = subDirEntry.createReader();
            dirReader.readEntries(function (entries) {
              if (entries.length > 0) {
                _this.hasFile = true;
                _this.fileList = entries;
                for (var i = 0; i < entries.length; i++) {
                  var entry = entries[i];
                  let path = entry.fullPath.split('ACCEdata/')[1];
                  console.log(path);
                  _this.fileList[i].name = path.split("-")[0];
                  _this.fileList[i].address = path.split("-")[1];
                  console.log(entry);
                }
              }else{
                _this.showToast = true;
                _this.msg = "slash.nodata"
                setTimeout(() => {
                  _this.showToast = false;
                },2000)
              }
            }, )
          }, _this.onErrorGetDir);
        }, _this.onErrorLoadFs);

      },
      onErrorGetDir() {
        console.log("文件夹创建失败！")
      },
      onErrorLoadFs(error) {   //FileSystem加载失败回调 
        console.log("文件系统加载失败！")
      },
      onErrorCreateFile(error) {   //文件创建失败回调
        console.log("文件创建失败！")
      },
      // 移动端用秘钥文件打开其他的钱包
      mobileOpenFile(event) {//open file and get content
        console.log("1");
        var _this = this;
        var Ext = event.target.value.substr(event.target.value.lastIndexOf(".")).toLowerCase();
        var FileExt = Ext.substr(1);

        var file = event.target.files[0];
        console.log("2");
        var reader = new FileReader();
        FileExt != '' ? reader.readAsText(file, 'gb2312') : reader.readAsText(file);

        reader.onload = function (e) {
          console.log("read success");
          let result = JSON.parse(e.target.result);

            // 判断是有相同账户的钱包
          if(_this.isSimilarWallet(result)=="similarName"){
            _this.showToast=true; _this.msg="common.haveSimilarName";
              return;
          }
          else if(_this.isSimilarWallet(result)=="similarAddress"){
            _this.showToast=true; _this.msg="common.haveSimilarWallet";
            return;
          }
          else{
            _this.showPwd = true;
          }
       

          localStorage.name = result.name;
          _this.ciphertext = result.ciphertext;
          _this.wallet = result;
          _this.showPwd = true;
        }
      },
      pcOpen(event) {
        var _this = this;

        var Ext = event.target.value.substr(event.target.value.lastIndexOf(".")).toLowerCase();
        var FileExt = Ext.substr(1);
        // var FileExt=Ext.replace(/.+\./,"");

        var file = event.target.files[0];
        var reader = new FileReader();
        FileExt != '' ? reader.readAsText(file, 'gb2312') : reader.readAsText(file);
        reader.onload = function (e) {
          let result = JSON.parse(this.result);

          // 判断是有相同账户的钱包
          if(_this.isSimilarWallet(result)=="similarName"){
            _this.showToast=true; _this.msg="common.haveSimilarName";
              return;
          }
          else if(_this.isSimilarWallet(result)=="similarAddress"){
            _this.showToast=true; _this.msg="common.haveSimilarWallet";
            return;
          }
          else{
            _this.showPwd = true;
          }

       

          localStorage.name = result.name;
          _this.ciphertext = result.ciphertext;
          _this.wallet = result;
        }
      },
      showToastVal(val) {//close prompt box
        this.openPwd = "";
        this.$refs.filepath.value = "";
        this.showToast = val;
      },
      closePwd() {
        this.showPwd = false;
      },
      // ios选择文件
      closFileList(val) {
        this.hasFile = false;
        if (!val) {
          return
        }
        let result = JSON.parse(val);

          // ios   判断是否同名钱包
            if(this.isSimilarWallet(result)=="similarName"){
              this.showToast=true; this.msg="common.haveSimilarName";
              return;
          }
          else if(this.isSimilarWallet(result)=="similarAddress"){
            this.showToast=true; this.msg="common.haveSimilarWallet";
            return;
          }
          else{
            this.showPwd = true;
          }

     

        localStorage.name = result.name;
        this.ciphertext = result.ciphertext;
        this.wallet = result;
    
      },
      openWallet() {//input password to pen wallet
        var _this = this;
        if (this.openPwd == "") {
          this.showToast = true;
          this.msg = "common.pwdNotNull";
          return false
        }
        // var Wallet = new MyWallet();
        var encrypt = new Encrypt();
        console.log(encrypt)
        this.showPwd = false;
        this.loading = true;
        console.log(JSON.stringify(this.ciphertext))
        this.$axios.post(this.baseUrl + "/wallet/get", {
          itext: encrypt.encode(JSON.stringify(this.ciphertext)),
          ptext: encrypt.encode(this.openPwd)
        }).then((res) => {
          _this.loading = false;
          if (res.data.code == 0) {
            var result = res.data.data

            localStorage.address = result.address;
            localStorage.currentWallet = JSON.stringify(_this.wallet);//当前钱包

            if (localStorage.wallet != undefined) {
              var wallet = JSON.parse(localStorage.wallet);
              console.log(wallet)
              let flag = false;

              for (var i = 0; i < wallet.length; i++) {
                if (wallet[i].name == _this.wallet.name) {
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                wallet.push(_this.wallet);
                localStorage.wallet = JSON.stringify(wallet);
              }
            } else {
              var arr = [];
              arr[0] = _this.wallet;
              localStorage.wallet = JSON.stringify(arr);
            }
            _this.$router.push('wallet');
          }else{
            _this.showToast = true; _this.msg = "common.pwdError";
          }
        }).catch((err) => {
          console.log(err)
        })

        // setTimeout(() => {
        //   Wallet.decryKeystore(JSON.stringify(_this.ciphertext), _this.openPwd).then((resp) => {//
        //     _this.loading = false;
        //     if (resp != '0') {
        //       localStorage.address = resp.address;
        //       localStorage.currentWallet = JSON.stringify(_this.wallet);//当前钱包

        //       if (localStorage.wallet != undefined) {
        //         var wallet = JSON.parse(localStorage.wallet);
        //         let flag = false;

        //         for (var i = 0; i < wallet.length; i++) {
        //           if (wallet[i].name == _this.wallet.name) {
        //             flag = true;
        //             break;
        //           }
        //         }
        //         if (!flag) {
        //           wallet.push(_this.wallet);
        //           localStorage.wallet = JSON.stringify(wallet);
        //         }
        //       } else {
        //         var arr = [];
        //         arr[0] = _this.wallet;
        //         localStorage.wallet = JSON.stringify(arr);
        //       }
        //       _this.$router.push('wallet');
        //       //              _this.$router.push({ name: 'wallet',  params:{address:resp.address}});
        //     } else {
        //       _this.showToast = true; _this.msg = "common.pwdError";
        //     }
        //   });
        // }, 1000);
      },
      compile(code) {//加密
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
      },
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
  @import "slash.component.scss";
  @import "../pwd/pwd.component";
</style>