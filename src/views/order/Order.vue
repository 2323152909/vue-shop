<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 顶部input输入框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="inputValue">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table 订单数据表格区域 -->
      <el-table :data="orderList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template v-slot="props">
            <el-tag v-if="props.row.pay_status === '0' " type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="props">
            {{props.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="props">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddressBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox(props.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 顶部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressVisibleClose">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormReg" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader v-model="addressForm.address1" :options="cityData" :props="cityProps">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查询快递进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <!-- 物流时间线 timeline 区域 -->
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrders } from '../../network/orders'
import cityData from './citydata'
import kuaidi from './kuaidi'

export default {
  name: 'order',
  data() {
    return {
      // input输入框双向绑定内容
      inputValue: '',
      //  订单查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据列表
      orderList: [],
      // 编辑顶大数据
      editOrder: {
        order_id: 0,
        order_number: '',
        order_price: 0,
        pay_status: '',
        is_send: '',
        create_time: 0
      },
      // 总数据条数
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: "请选择省市区/县", trigger: "change" }],
        address2: [{ required: true, message: "请填写详细地址", trigger: "blur" }]
      },
      //   省市区/县文档
      cityData,
      cityProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      progressVisible: false,
      progressInfo: [],
      //   物流数据
      kuaidi,
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获取订单数据列表
    async getOrderList() {
      const { data: res } = await getOrders(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }
      //   console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听页面数据条数改变触发函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 监听页码改变触发函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showAddressBox() {
      this.addressVisible = true
    },
    addressVisibleClose() {
      this.$refs.addressFormReg.resetFields();
    },
    showProgressBox(rowInfo) {
      console.log(rowInfo);
      const res = this.kuaidi;
      if (res.meta.status !== 200) {
        return this.$message.error("查询物流信息失败！");
      }
      //   console.log(res);

      this.progressInfo = res.data;
      //   console.log(this.progressInfo);

      this.progressVisible = true;
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>