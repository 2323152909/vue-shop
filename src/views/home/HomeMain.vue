<template>
  <el-main>
    <router-view></router-view>
  </el-main>
</template>

<script>
import Welcome from '../../components/Welcome.vue'
  export default {
    name:'HomeMain',
    components:{
      Welcome
    }
  }
</script>

<style lang="less" scoped>

</style>