<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 权限主体表格区域 -->
      <el-table :data="rightsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="parseInt(scope.row.level) === 0">一级</el-tag>
            <el-tag v-else-if="parseInt(scope.row.level) === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights } from '../../network/power'

export default {
  name: 'rights',
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    // 胡哦哦去所有权限
    this.getRightsList();
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await getRights('list');
      if (res.meta.status !== 200) return this.$messsage.error("请求数据失败！")
      this.rightsList = res.data;
      // console.log(this.rightsList);
    }
  }
}
</script>

<style lang="less" scoped>
</style>