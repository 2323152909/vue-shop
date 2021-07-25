<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加/搜索商品行 -->
      <el-row :gutter="20">
        <!-- 搜索商品列 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品列 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 内容表格区域 -->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column label="创建时间" width="140">
          <template v-slot="props">
            <!-- 通过过滤器将时间戳过滤为格式化时间 -->
            {{props.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template v-slot="props">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showGoods(props.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoodsById(props.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>

      <!-- 编辑商品弹窗 -->
      <el-dialog title="提示" :visible.sync="editGoodsDialogVisible" width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormReg" label-width="100px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍">
            <el-input v-model="editForm.goods_introduce"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoods">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getGoods, removeGoods, getGoodsById, editGoods } from '../../network/goods'

export default {
  name: 'list',
  data() {
    return {
      // 商品查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据列表
      goodsList: [],
      // 商品总数
      total: 0,
      editForm: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      editGoodsDialogVisible: false,
      editFormRules: {
        goods_name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请填写商品价格", trigger: "blur" }],
        goods_number: [{ required: true, message: "请填写商品数量", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请填写商品重量", trigger: "blur" }],
      }
    }
  },
  created() {
    // List页面创建时请求数据
    this.getGoodsList();
  },
  methods: {
    // 获取商品数据列表
    async getGoodsList() {
      const { data: res } = await getGoods(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("商品数据请求失败！");
      }
      this.$message.success("获取商品数据成功！")
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      // console.log(res);
    },
    // 监听pagesize每页数量改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听 pagenum页码的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 监听删除商品数据接口
    async removeGoodsById(goodsInfo) {
      const confirmResult = await this.$confirm("该操作将永久删除此商品数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("成功取消该操作！");
      }

      const { data: res } = await removeGoods(goodsInfo.goods_id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除该商品失败！");
      }

      this.$message.success("删除商品数据成功！");

      this.getGoodsList();
    },
    async showGoods(goodsInfo) {
      console.log(goodsInfo);
      console.log(goodsInfo.goods_id);
      const { data: res } = await getGoodsById(goodsInfo.goods_id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品数据失败！");
      }
      this.editForm.goods_id = goodsInfo.goods_id;
      this.editForm.goods_name = res.data.goods_name;
      this.editForm.goods_price = res.data.goods_price;
      this.editForm.goods_number = res.data.goods_number;
      this.editForm.goods_weight = res.data.goods_weight;
      this.editForm.goods_introduce = res.data.goods_introduce;
      this.editForm.pics = res.data.pics;
      this.editForm.attrs = res.data.attrs;
      console.log(this.editForm);

      this.editGoodsDialogVisible = true;
    },
    async editGoods() {
      const { data: res } = await editGoods(this.editForm.goods_id, this.editForm);
      console.log(res);
      if (res.meta.status !== 201) {
        return this.$message.error("修改商品数据失败！");
      }
      this.$message.error("修改商品数据成功！");
      this.getGoodsList();
      this.editGoodsDialogVisible = false;
    },
    // 点击添加商品按钮，跳转到添加商品页
    goAddPage() {
      this.$router.push('/goods/add');
    }
  }
}
</script>

<style lang="less" scoped>
</style>