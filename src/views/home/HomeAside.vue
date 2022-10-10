<template>
  <el-aside :width="iscollapse? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">| | |</div>
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/' + item1.path)">
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{ item1.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { MenuList } from "../../network/home";
export default {
  name: "HomeAside",
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 图标列表
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      iscollapse: false,
      activePath: ''
    };
  },
  created() {
    this.getMenuList();
    // 获取保存的活跃状态
    this.activePath = sessionStorage.getItem('activePath');
  },
  methods: {
    async getMenuList() {
      const { data: res } = await MenuList();
      if (res.meta.status !== 200) return this.$message.error("获取数据失败！");
      // this.$message.success(res.meta.msg);
      this.menulist = res.data;
      // console.log(res);
    },
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
};
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 25px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>