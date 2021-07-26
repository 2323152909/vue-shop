<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts包
import * as echarts from 'echarts'
import _ from 'lodash'
import { request1 } from '../../network/request'

export default {
  name: 'report',
  data() {
    return {
      // 需要合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    this.getReportsList();
  },
  async mounted() {
    //   3.基于准备好的dom，初始化echarts实例
    let myCharts = echarts.init(document.getElementById('main'));

    const { data: res } = await request1({
      url: 'reports/type/1',
      method: 'get'
    });
    if (res.meta.status !== 200) {
      return thiis.$message.error("获取报表数据失败！")
    }
    console.log(res);
    // 4.指定图表的配置项和数据
    // 合并数据
    const result = _.merge(res.data, this.options);

    console.log(this.options);
    //   5.使用刚指定的配置项和数据显示图表
    myCharts.setOption(result);
  },
  methods: {
    getReportsList() {

    },
  }
}
</script>

<style lang="less" scoped>
</style>