<!--The content below is only a placeholder and can be replaced.-->
<template>
  <div class="warning-content">
    <form class="warning-toast">
      <div class="warning-input">
        <h4>{{$t("warning.title")}}</h4>
      </div>
      <div class="warning-btn">
        <a class="" @click="closeWarn()">╳ Yes I am Sure</a>
        <a >Download Now</a>
      </div>
    </form>
  </div>

</template>

<script>
  export default {
    data(){
      return{

      }
    },
    props:["showWarning"],
    methods:{
      closeWarn() {
        this.$emit("showWarning",false);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "warning.component";
</style>
