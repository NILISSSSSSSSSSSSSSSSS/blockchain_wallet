<template>
    <div class="toast">
      <div  class="toast-content">
        <div class="toast-close" @click="close()">
          <i></i><i></i>
        </div>
        <slot name="title" class="title"></slot>
        <h3>{{$t(msg)}}</h3>
      </div>
    </div>
</template>

<script>
    export default {
      name: "toast",
      data(){
          return{

        }
      },
      props:["msg"],
      methods:{
        close(){
          this.$emit("showToast",false)
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "toast.component";
</style>
