<template>
  <div id="app">
    <close v-if="showClose" :title="title"></close>
    <close1 v-if="showClose1" :title="title"></close1>

    <div class="version-toast" v-if="showVersionToast">
      <div class="version-content">
        <p>{{$t("home.versionUpdate")}}</p>
      </div>
    </div>
    <div class="version-progress-bar" v-show="showVersionToast">
      <div ref="progress" style="background-color: rgb(229, 229, 229);z-index: 10; opacity: 1; position: absolute; top: 0px; left: 0px; width: 0; height: 10px; transition: width 2s, opacity 0.6s;"></div>
    </div>
   
    <Toast :msg="msg" v-if="showToast" @showToast="showToastVal(val)"></Toast>
    <span style="position: absolute;right: 0px;top: 20px;color:white;font-size: 24px;">.</span>
    <router-view/>
  </div>
</template>

<script>
  import Close from "./components/common/close.component.vue"
  import Close1 from "./components/common/close1.component.vue"
  import Toast from "./components/common/toast.component"
  export default {
    name: 'App',
    data() {
      return {
        locale: "en",
        isLang: (localStorage.lng == '0') ? true : false,
        showClose: (localStorage.to_path == "1") ? true : false,
        showClose1: (localStorage.to_path == "0") ? true : false,
        title: (localStorage.path_name != null) ? localStorage.path_name : "",
        showVersionToast: false, showToast: false, msg: "", isMobile: false,
        isIOS: false, firstEnterApp: false,
        
      }
    },
    components: { Close, Close1, Toast },
    created() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ios移动端
        this.isMobile = true;
        this.isIOS = true;
      } else if (/(Android)/i.test(navigator.userAgent)) { //移动端
        this.isMobile = true;
      }else{
        this.isMobile = false;
      }
   
    },
    mounted() {
      this.$nextTick(() => {
        document.body.onselectstart=function(event){
          if(event.target.id=="keyprivate"){
            return true           
          }
          else{
            return false;
          }
        }
      })
   

      if (localStorage.lng == '0') {
        this.locale = 'cn'
      } else {
        this.locale = 'en';
      }
      localStorage.lng = (this.locale == 'en' ? '1' : '0');
      let to = localStorage.path_name == "" || localStorage.path_name == undefined
      if (to) {
       
        this.$router.push("/");
      }
      if (localStorage.wallet == undefined) {
        console.log(234455)
        // localStorage.setItem("firstEnterApp",true)
        this.firstEnterApp = true
        this.$router.push("/slash");
      }
      if (localStorage.to_path == "") {
        this.showClose = false;
        this.showClose1 = false;
      }
      let _this = this;
      document.addEventListener(
        'deviceready',
        function () {
          _this.getVersion();
        },
        false
      );
      
    },
    watch: {
      locale(val) {
        this.$i18n.locale = val;
      },
      $route(to, from) {
        // console.log(to,from)
        // console.log(this.firstEnterApp)
        let toRoutePath = to.path.substring(1);
        if (toRoutePath == "wallet") {
          this.title = localStorage.name;
          if (this.isMobile) this.getVersion();
        }
        if (toRoutePath == "create" || toRoutePath == "download" || toRoutePath == "slash") {
          this.showClose = true;
          this.showClose1 = false;
          this.showLan = false;
          localStorage.to_path = 1;
          if (localStorage.wallet == undefined && toRoutePath == "slash") {
            this.showClose = false;
            localStorage.to_path = "";
          }
          if (toRoutePath == "slash") {
            if (this.isMobile && !this.firstEnterApp) this.getVersion();
            this.firstEnterApp = false
          }
        } else if (toRoutePath == "") {
          this.showClose = false;
          this.showClose1 = false;
          this.showLan = true;
          localStorage.to_path = "";
          if (this.isMobile) this.getVersion();
        } else {
          this.showClose = false;
          this.showClose1 = true;
          this.showLan = false;
          localStorage.to_path = 0;
        }
        this.title = toRoutePath;
        localStorage.path_name = toRoutePath;
        if (toRoutePath == "wallet") {
          localStorage.path_name = localStorage.name;
          this.title = localStorage.name;
        }
      },
    },
    methods: {
      getVersion() {
        this.$axios.get("http://apk-1253880684.coscd.myqcloud.com/Acce/updateAcce.json").then((res) => {
          let data = res.data
          let appDownloadUrl = data.appUrl
          let currentVersionDot = this.currentVersionDot
          let iosCurrentVersionDot = this.iosCurrentVersionDot
          let jxVersion = data.version //之前姜霞的版本更新字段

          let version = data.newVersion // v1.0.8
          let appVersion = version.slice(0, 2) //v1
          let hotVersion = Number(version.slice(3)) // 0.8

          let iosVersion = data.iosVersion
          let iosAppVersion = iosVersion.slice(0, 2)
          let iosHotVersion = Number(iosVersion.slice(3))
          if (this.isIOS) {
            if (iosAppVersion === iosCurrentVersionDot.slice(0, 2)) {
              //判断热更新
              let iosCurrHotVersion = Number(iosCurrentVersionDot.slice(3))
            
              if (iosHotVersion > iosCurrHotVersion) {
                console.log("苹果进行热更新")
                // this.showToastInfo("进行热更新")
                hotUpdate("http://apk-1253880684.coscd.myqcloud.com/Acce/updateIos/chcp.json")
              } else {
                // this.showToastInfo("暂无热更新") 
              }
            } else {
              //进行app更新
              // this.showToastInfo("有新版本的发现，请到AppStore下载")
            }
          } else {
            if (appVersion === currentVersionDot.slice(0, 2)) {
               
              //判断热更新
              let currHotVersion = Number(currentVersionDot.slice(3))
              if (hotVersion > currHotVersion) {
                console.log("安卓进行热更新")
                // this.showToastInfo("进行热更新")
                hotUpdate('http://apk-1253880684.coscd.myqcloud.com/Acce/update/chcp.json')
              } else {
                // this.showToastInfo("暂无热更新")
              }
            } else {
              //进行app更新
              this.showVersionToast = true;
              this.$refs.progress.style.width = "0"
              console.log("开始下载apk")
              this.downLoadApp(appDownloadUrl);
            }
          }

        })
        function hotUpdate(configUrlFile) {
          chcp.getVersionInfo(function (err, data) {
            console.log('Current web version: ' + data.currentWebVersion);
            console.log('Previous web version: ' + data.previousWebVersion);
            console.log('Loaded and ready for installation web version: ' + data.readyToInstallWebVersion);
            console.log('Application version name: ' + data.appVersion);
            console.log('Application build version: ' + data.buildVersion);
            var options = {
              'config-file': configUrlFile
            };
            chcp.fetchUpdate(updateCallback, options);

            function updateCallback(error, data) {
              if (error) {
                console.log('--fetchUpdate error--', error.code, error.description);
                return false
              }
              console.log('--fetchUpdate--', data, data.config);
              chcp.installUpdate(installationCallback);
              function installationCallback(error) {
                if (error) {
                  console.log('Failed to install the update with error code: ' + error.code);
                  console.log(error.description);
                } else {
                  // alert("热更新成功")
                  console.log('Update installed!');
                }
              }
            }
          })
        }
      },
      downLoadApp(url) {
        var _this = this;
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
          console.log('file system open: ' + fs.name);
          fs.root.getFile('wallet.apk', { create: true, exclusive: false }, function (fileEntry) {
            fileEntry.remove(function () {
              console.log('File successufully removed.');
              _this.downloadApk(fileEntry, url, true);
            }, _this.onErrorRemoveFile);
          }, _this.onErrorCreateFile);
        }, _this.onErrorLoadFs);
      },
      downloadApk(fileEntry, uri, readBinaryData) {
        console.log('fileEntry:' + fileEntry)
        console.log('uri', uri)
        var _this = this;
        var fileTransfer = new FileTransfer();
        var fileURL = fileEntry.toURL();
        console.log('fileURL:' + fileURL)
        fileTransfer.download(uri, fileURL,
          function (entry) {
            console.log("Successful download...");
            console.log("download complete: " + entry.toURL());
            console.log('readBinaryData', readBinaryData)
            if (readBinaryData) {
              console.log("下载完毕正准备打开")
              // Read the file...
              _this.openApk(entry.toURL());
            }
            else {
              // Or just display it.
              // displayImageByFileURL(entry);
              _this.showVersionToast = false;
              _this.showToastInfo("下载失败")
            }
          },
          function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
            _this.showVersionToast = false;
            _this.showToastInfo("下载失败")
          },
          null, // or, pass false
          {}
        );
        fileTransfer.onprogress = function (e) {
          // console.log(e.lengthComputable)
          if (e.lengthComputable) {
            let percent = (e.loaded / e.total) * 100 + '%'
            _this.$refs.progress.style.width = percent
           
          } else {
            this.showToastInfo("下载失败")
          }
        }
      },
      openApk(toURL) {
        console.log("打开apk")
        var _this = this;
        this.$refs.progress.style.width = "0"
        this.showVersionToast = false;
        cordova.plugins.fileOpener2.open(
          toURL, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
          'application/vnd.android.package-archive',
          {
            error: function (e) {
              this.showToastInfo("打开失败")
              console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success: function () {
              console.log('file opened successfully');
            }
          }
        );
      },
      onErrorLoadFs(error) {   //FileSystem加载失败回调 
        console.log(error)
        console.log("文件系统加载失败！");
        this.showToastInfo()
      },
      onErrorCreateFile(error) {   //文件创建失败回调
        console.log(error)
        console.log("文件创建失败！")
        this.showToastInfo()
      },
      onErrorRemoveFile(error) {
        console.log(error)
        console.log("文件删除失败！")  //文件删除失败回调
        // this.showToastInfo()
      },
      showToastVal(val) {//close prompt box
        this.showToast = val;
      },
      showToastInfo(val = "更新失败") {
        this.showToast = true
        this.msg = val
        setTimeout(() => {
          this.showToast = false
        }, 2000)
      }
    }
  }
</script>

<style>
  /*设置IOS页面长按不可复制粘贴，但是IOS上出现input、textarea不能输入，因此将使用-webkit-user-select:auto;*/

  * {
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -khtml-user-select: none;
    /*早期浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;
  }

  input,
  textarea,
  button,
  select,
  radio,
  checkbox,
  .keyprivate {
    -webkit-touch-callout: auto;
    /*系统默认菜单被禁用*/
    -webkit-user-select: auto;
    /*webkit浏览器*/
    -khtml-user-select: auto;
    /*早期浏览器*/
    -moz-user-select: auto;
    /*火狐*/
    -ms-user-select: auto;
    /*IE10*/
    user-select: auto;

  }



  ::placeholder {
    color: #ababab
  }

  ::-webkit-scrollbar {
    display: none;
  }

  input[type="number"] {
    -moz-appearance: none;
    appearance: none;
  }
.beiFenBox h3{
  text-align: left;
}
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;

    /* overflow-y: scroll; */
  }

  #app>div:last-child {
    padding-top: 5rem;
    overflow-y: auto
  }

  #app>div.home {
    padding-top: 0rem
  }

  #app>div.send,
  #app>div.recv,
  #app>div.keyImport {
    padding-top: 7rem
  }

  .version-toast {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .version-content {
    width: 30%;
    height: 6rem;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    color: #ffffff;
    border-radius: 10px;
    position: relative;
    font-size: 0.9rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .version-progress-bar {
    position: absolute;
    padding: 5%;
    width: 60%;
    left: 15%;
    top: 58%;
  }

  @media screen and (min-width: 768px) {
    .home-top {
      max-width: 900px;
    }
  }
</style>