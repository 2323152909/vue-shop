<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name:'home',
    methods: {
      // 退出登录
      logout(){
        // 清空存储的token
        sessionStorage.clear('token');
        // 重定向到login
        this.$router.push('/login')
      }
    },
  }
</script>

<style lang="less" scoped>

</style>