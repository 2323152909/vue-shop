<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button class="home-out" type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <home-aisde/>
      <!-- 右侧内容主体 -->
      <home-main/>
    </el-container>
  </el-container>
  <!-- 退出登录 -->
</template>

<script>
import HomeAisde from '../views/home/HomeAside.vue'
import HomeMain from '../views/home/HomeMain.vue'

export default {
  name: "home",
  components:{
    HomeAisde,
    HomeMain
  },
  methods: {
    // 退出登录
    logout() {
      // 清空存储的token
      sessionStorage.clear("token");
      // 重定向到login
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedfe;
}
</style>