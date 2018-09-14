<template>
<div class="fileList" @click.prevent="close($event)">
    <div class="list-content">
        <div class="listgroup">
            <div class="list" v-for="(item, index) in fileList" @click="iosReadFile(item)" :key="index">
                <p class="name">{{item.name}}</p>
                <p class="address">{{item.address}}</p>
            </div>
        </div>
    </div>
    
</div>
    
</template>

<script>
export default {
  props: { fileList: Array },
  data(){
      return{

      }
  },
  methods:{
      close(e){
          e.target.className==='fileList' && this.$emit('closFileList', null)
      },
      iosReadFile(fileEntry){
          console.log("jin");
          var _this=this;
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function () {
              console.log("file read success:" + this.result);
              _this.$emit("closFileList",this.result)
          };
          reader.readAsText(file);
        }, _this.onErrorReadFile);
      },
      onErrorReadFile(){
        console.log("读取文件失败");
      }
  }
};
</script>

<style lang="scss" scoped>
.fileList{
    width: 100%;height: 100%;position: fixed;bottom: 0px;left:0;z-index:8;background-color: rgba(0,0,0,0.3);
    display: flex;justify-content: center;align-items: center ;flex-direction: column;
    .list-content{
        width: 84%;
        max-height: 250px;
        background-color: #fff;
        border-radius:5px;
        padding: 3%;
    }
    .listgroup{
        max-height: 250px;
        overflow-y: auto;
    }
    .list{
        width: 100%;
        padding: 5px 0;
        .name{
            font-size: 18px;            
            text-align: left;
            word-wrap: break-word;
        }
        .address{
            font-size: 13px;
            word-wrap: break-word;
            text-align: left;
        }
        &:not(:last-child){
             border-bottom: 1px solid #f2f2f2;
        }
       
    }
  }
  .close{
    position: absolute;top: -10px;right: 0;height:40px;width:40px;font-size: 1.8rem;background: #FFFFFF;
    box-shadow: 0 17px 13px 0 rgba(0,0,0,0.20);border-radius:50%;
    i{
      width: 16px; height: 2px; display: block;font-style: normal;background: #aaaaaa;position:absolute;top: 18px; left: 13px;
      &:first-child{
        transform: rotate(45deg);
      }
      &:last-child{
        transform: rotate(-45deg);
      }
    }
  }
</style>

