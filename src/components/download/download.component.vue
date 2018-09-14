<template>
  <div class="download">
    <p class="tip">
      {{$t("download.tip1")}}
      <b>{{$t("download.tip2")}}</b>
      {{$t("download.tip3")}}
      <b>{{$t("download.tip4")}}</b>
      <font style="font-size: 1rem;">{{$t("download.tip5")}}</font>
      </br>
      {{$t("download.tip6")}}
      <b>{{$t("download.tip7")}}</b>
      {{$t("download.tip8")}}
      <font style="font-size: 1rem;">{{$t("download.tip9")}}</font>
    </p>
    <div class="download-content">
      <div class="download-file" @click="download()" :style="marginStyle">
        <img src="../../assets/images/download.png" height="43" width="43" />
        <p>{{$t("download.btn")}}</p>
      </div>
      <a class="openNow" @click="showInputPwd(true)" :style="marginStyle">{{$t("download.openThis")}}</a>

      <div class="line" :style="marginStyle">
        <img src="../../assets/images/line 1.png" height="3" width="45%" />
        <span>{{$t("slash.or")}}</span>
        <img src="../../assets/images/line 1.png" height="3" width="45%" />
      </div>
      <!--用密钥打开其他的钱包-->
      <a class="openOther" v-if="isMobile" @click="showInputPwd(false)" :style="marginStyle">
        {{$t("download.openOther0")}}
      </a>

      <!--用密钥文件打开其他的钱包-->
      <label class="openOther" v-if="isMobile" :style="marginStyle">
        <input v-if="!isIOS" type="file" @change="mobileOpenFile($event)" ref="filepath">
        <a v-if="!isIOS">{{$t("download.openOther")}}</a>
        <!--ios用密钥文件打开其他的钱包-->
        <a v-if="isIOS" @click="getAndReadFile()" ref="filepath">{{$t("download.openOther")}}</a>

      </label>
      <label class="openOther" v-if="!isMobile" :style="marginStyle">
        <input type="file" @change="pcOpen($event)" ref="filepath">
        <a>{{$t("download.openOther")}}</a>
      </label>
      <a class="createNew" @click="toCreate()" :style="marginStyle">{{$t("download.create")}}</a>

    </div>

    <div class="warning-content" v-if="showWarning">
      <form class="warning-toast">
        <div class="pwd-close" @click="closeWarn()">
          <i></i>
          <i></i>
        </div>
        <div class="warning-input">
          <h4>{{$t("warning.title")}}</h4>
        </div>
        <div class="warning-btn">
          <a @click="showOpenPwd()">╳ {{$t("warning.ok")}}</a>
          <a @click="download()">{{$t("warning.downLoad")}}</a>
        </div>
      </form>
    </div>

    <div class="downLoad-Ways" v-if="showWays">
      <form class="downLoad-toast">
        <div class="pwd-close" @click="closeWays()">
          <i></i>
          <i></i>
        </div>
        <div class="warning-btn">
          <a @click="mobileDownload()">{{$t("download.downLoadFile")}}</a>
          <a @click="createAndWriteFile()">{{$t("download.downLoadKeystroe")}}</a>
        </div>
      </form>
    </div>

    <div class="pwd-content" v-if="showPwd">
      <form class="pwd-toast">
        <div class="pwd-close" @click="closePwd()">
          <i></i>
          <i></i>
        </div>
        <div class="pwd-input">
          <h4>{{$t("common.openPwdTitle")}}</h4>
          <input type="password" v-model="thisPwd" v-focus>
        </div>
        <div class="pwd-btn">
          <a @click="openWallet()">{{$t("common.open")}}</a>
        </div>
      </form>
    </div>

    <KeyExport :mywallet="wallet" :isDownload="isDownload" v-if="showExport" @showExport="showExportVal($event)" @isCopy="isCopy($event)"></KeyExport>
    
     <!--ios列表展示-->
    <file-list v-if="hasFile" :fileList="fileList" @closFileList="closFileList($event)"></file-list>

    <toast :msg="msg" v-if="showToast" @showToast="showToastVal($event)"></toast>
    <Loading v-if="loading"></Loading>
  </div>
</template>

<script>
  import { saveAs } from "../../assets/js/FileSaver.js";
  import { Encrypt } from "../../assets/js/wallet.js";
  import KeyExport from "../keyExport/keyExport.component";
  import Toast from "../common/toast.component";
  import Loading from "../common/loading.component";
   import FileList from "../common/fileList"
  export default {
    data() {
      return {
        showPwd: false,
        openPwd: "",
        loading: false,
        ciphertext: "",
        showToast: false,
        msg: "",
        isDownload: false,
        showWarning: false,
        thisPwd: "",
        downStyle: "",
        isMobile: false,
        showExport: false,
        isOpenThis: true,
        marginStyle: "",
        wallet: "",
        showWays: false,
        address: "",
        isIOS: false,
        hasFile: false,
        fileList: [{ 'name': 'a', "address": "ahdukshfkstrhtikrnkfhiurbgk" }, { 'name': 'a', "address": "ahdukshfkstrhtikrnkfhiurbgk" }]
      };
    },
    components: { Toast, Loading, KeyExport, FileList},
    beforeMount() {
      // this.ciphertext=this.$route.params.ciphertext;
      console.time("download");
      this.ciphertext = JSON.stringify(
        JSON.parse(localStorage.currentWallet).ciphertext
      );
      this.address = localStorage.address;
      this.walletName = localStorage.name;
      this.wallet = localStorage.currentWallet;
      console.timeEnd("download");
      const screenHeight = window.screen.availHeight;
      if (screenHeight < 850) {
        this.marginStyle = { marginBottom: "1.8rem" };
      }
    },
    mounted() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //移动端
        this.isMobile = true;
        this.isIOS = true;
      } else if (/(Android)/i.test(navigator.userAgent)) {
        this.isMobile = true;
        this.isIOS = false;
      } else {
        this.isMobile = false;
      }
    },
    methods: {
      toCreate() {
        history.go(-1);
      },
      download() {
        //点击下载
        this.isMobile
          ? ((this.showWays = true), (this.showWarning = false))
          : this.pcDownload(); //是否是移动端下载
      },
      mobileDownload() {
        //移动端下载
        this.showWarning = false;
        this.showExport = true; //打开下载界面
        this.showWays = false;
      },
      isCopy(val) {
        //移动端是否下载
        console.log(val);
        console.log(this.isDownload);
        this.showExport = false;
        this.isDownload = val;
      },

      /* 
      * 打开或创建文件夹,创建文件并写入内容 
      * Android:sdcard/xbrother/assets目录 
      * IOS:cdvfile://localhost/persistent/xbrother/assets目录 
      * 文件目录存在则打开,不存在则创建 
      * */

      createAndWriteFile() {
        var _this = this;
        var walletname = _this.walletName + "-" + _this.address;
        window.requestFileSystem(
          LocalFileSystem.PERSISTENT,
          0,
          function (fs) {
            console.log("打开的文件系统: " + fs.name);
            fs.root.getDirectory(
              "ACCEdata",
              { create: true },
              function (subDirEntry) {
                subDirEntry.getFile(
                  walletname,
                  { create: true, exclusive: false },
                  function (fileEntry) {
                    fileEntry.name == walletname;
                    fileEntry.fullPath == "ACCEdata/" + walletname;
                    //文件内容
                    var dataObj = new Blob([_this.wallet], {
                      type: "text/plain"
                    });
                    //写入文件
                    _this.writeFile(fileEntry, dataObj);
                  },
                  _this.onErrorCreateFile
                );
              },
              _this.onErrorGetDir
            );
          },
          _this.onErrorLoadFs
        );
      },
      writeFile(fileEntry, dataObj) {
        //将内容数据写入到文件中
        var _this = this;
        //创建一个写入对象
        fileEntry.createWriter(function (fileWriter) {
          //文件写入成功
          fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            _this.showWays = false;
            _this.showToast = true;
            _this.msg = "wallet.DownloadSuccess";
            _this.isDownload = true;
          };
          //文件写入失败
          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
            _this.showWays = false;
            _this.showToast = true;
            _this.msg = "wallet.DownloadFailure";
          };
          //写入文件
          fileWriter.write(dataObj);
        });
      },
      onErrorLoadFs(error) {
        //FileSystem加载失败回调
        console.log("文件系统加载失败！");
      },
      onErrorGetDir() {
        console.log("文件夹创建失败！");
      },
      onErrorCreateFile(error) {
        //文件创建失败回调
        console.log("文件创建失败！");
      },
      filename() {
        let date = new Date();
        let fileName = this.walletName + "-" + this.address;
        // date.getFullYear() +
        // "-" + ((date.getMonth() + 1)< 10 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1)) +
        // "-" + (date.getDate()<10?'0'+date.getDate():date.getDate()) +
        // "=" + date.getHours() +
        // "-" + date.getMinutes() +
        // "-" + date.getSeconds()+
        // "--" + this.address;
        return fileName;
      },
      pcDownload() {
        //pc下载
        var file = new File([localStorage.currentWallet], this.filename(), {
          type: "charset=utf-8;json/plain"
        });
        saveAs(file);
        this.showWarning = false;
        this.isDownload = true;
      },
      showInputPwd(val) {
        //判断是否下载，是否弹出输入密码界面
        console.log(val);
        this.isOpenThis = val;
        if (this.isDownload) {
          //已经下载
          if (val == true) {
            //弹出输入密码界面
            this.showPwd = true;
          } else {
            //移动端跳转至导入界面
            this.$router.push("keyimport");
          }
          this.showWarning = false;
        } else {
          //弹出警告界面
          this.showWarning = true;
        }
      },
      showOpenPwd() {
        //判断是否打开当前钱包，是否弹出输入密码界面
        if (this.isOpenThis) {
          //移动端/PC弹出输入密码界面
          this.showWarning = false;
          this.showPwd = true;
        } else {
          //移动端跳转至导入界面
          this.$router.push("keyimport");
        }
      },
      mobileOpenFile(event) {
        console.log("read start");
        var _this = this;
        var Ext = event.target.value
          .substr(event.target.value.lastIndexOf("."))
          .toLowerCase();
        var FileExt = Ext.substr(1);

        var file = event.target.files[0];

        var reader = new FileReader();
        FileExt != ""
          ? reader.readAsText(file, "gb2312")
          : reader.readAsText(file);

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
          _this.ciphertext = JSON.stringify(result.ciphertext);
          _this.wallet = result;
    
        };
      },
      pcOpen(event) {
        //PC端打开文件
        var _this = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "gb2312");
        //    reader.readAsDataURL(file);
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
           _this.ciphertext = JSON.stringify(result.ciphertext);
          _this.wallet = result;
        };
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
      openWallet() {
        //打开钱包
        var _this = this;
        if (this.thisPwd == "") {
          this.showToast = true;
          this.msg = "common.pwdNotNull";
          return false;
        }
        // let Wallet = new MyWallet();
        var encrypt = new Encrypt();
        this.showWarning = false;
        this.showPwd = false;
        this.loading = true;
        this.$axios.post(this.baseUrl + "/wallet/get", {
          itext: encrypt.encode(this.ciphertext), 
          ptext: encrypt.encode(this.thisPwd)
        }).then((resp) => {
          if (resp.data.code == 0) {
            _this.loading = false;
            let result = resp.data.data
            localStorage.address = result.address;
            if (typeof this.wallet != "object") {
              this.wallet = JSON.parse(this.wallet);
            }
            localStorage.currentWallet = JSON.stringify(this.wallet); //当前钱包

            if (localStorage.wallet != undefined) {
              var wallet = JSON.parse(localStorage.wallet);
              let flag = false;
              for (var i = 0; i < wallet.length; i++) {
                if (wallet[i].name == this.wallet.name) {
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                wallet.push(this.wallet);
                localStorage.wallet = JSON.stringify(wallet);
              }
            } else {
              var arr = [];
              arr.push(this.wallet);
              localStorage.wallet = JSON.stringify(arr);
            }
            _this.$router.push("wallet");
          } else {
            _this.loading = false;
            _this.showToast = true;
            _this.msg = "common.pwdError";
          }
        }).catch((err) => {
          this.loading = false;
          this.showToast = true;
          this.msg = "common.openFail";
          return false;
        })


        // setTimeout(() => {
        //   try {
        //     Wallet.decryKeystore(_this.ciphertext, _this.thisPwd).then(resp => {
        //       if (resp != "0") {
        //         _this.loading = false;
        //         localStorage.address = resp.address;
        //         if (typeof this.wallet != "object") {
        //           this.wallet = JSON.parse(this.wallet);
        //         }
        //         localStorage.currentWallet = JSON.stringify(this.wallet); //当前钱包

        //         if (localStorage.wallet != undefined) {
        //           var wallet = JSON.parse(localStorage.wallet);
        //           let flag = false;
        //           for (var i = 0; i < wallet.length; i++) {
        //             if (wallet[i].name == this.wallet.name) {
        //               flag = true;
        //               break;
        //             }
        //           }
        //           if (!flag) {
        //             wallet.push(this.wallet);
        //             localStorage.wallet = JSON.stringify(wallet);
        //           }
        //         } else {
        //           var arr = [];
        //           arr.push(this.wallet);
        //           localStorage.wallet = JSON.stringify(arr);
        //         }
        //         _this.$router.push("wallet");
        //       } else {
        //         _this.loading = false;
        //         _this.showToast = true;
        //         _this.msg = "common.pwdError";
        //       }
        //     });
        //   } catch (e) {
        //     this.loading = false;
        //     this.showToast = true;
        //     this.msg = "common.openFail";
        //     return false;
        //   }
        // }, 200);
      },
      closeWays() {
        //关闭下载页面
        this.showWays = false;
      },
      closeWarn() {
        //关闭警告界面
        this.showWarning = false;
      },
      closePwd() {
        //关闭输入密码界面
        this.showPwd = false;
      },
      showExportVal(val) {
        //关闭拷贝界面
        this.showExport = val;
      },
      showToastVal(val) {
        //关闭toast界面
        this.openPwd = "";
        if (!this.isMobile) this.$refs.filepath.value = "";
        this.showToast = val;
      },
      goBack() {
        //返回
        this.location.back();
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "download.component";
  @import "../pwd/pwd.component";
</style>