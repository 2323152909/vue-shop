<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片视图区域 -->
    <el-card class="box-card">
      <!-- 按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- table表格主体区域 -->
      <tree-table :data="cateList" :columns="columns" stripe border :selection-type="false" :expand-type="false" show-index index-text="#" :show-row-hover="false">
        <!-- 是否有效 列的具名插槽使用 -->
        <template v-slot:isOk="props">
          <i v-if="props.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 排序 列的具名插槽使用 -->
        <template v-slot:level="props">
          <el-tag v-if="props.row.cat_level === 0" type="primary" size="mini">一级</el-tag>
          <el-tag v-else-if="props.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <!-- 操作 列的具名插槽使用，并将该作用域中的数据传入后代 -->
        <template v-slot:opt="props">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(props.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(props.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 底部分页区域 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" :page-sizes="[3, 5, 10, 15]" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCate">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="cateFormRules" ref="addCateFormReg" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <!-- 可以实现只选中一级change-on-select -->
          <el-cascader :options="parentCartList" v-model="selectedKeys" :props="cascaderProps" @change="parentCateChanged" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类提交弹窗 -->
    <el-dialog title="提示" :visible.sync="editCateDialogVisible" width="50%">
      <!-- 编辑分类的表单 -->
      <el-form :model="editCateForm" :rules="cateFormRules" ref="editCateFormReg" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getCates, addCate, getCateById, editCate, removeCate } from '../../network/goods'

export default {
  name: "cate",
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品数据列表，默认为空
      cateList: [],
      //  总数据条数
      totalCate: 0,
      currentCatePage: '',
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板页
          type: "template",
          // 表示当前这一列使用的模板名名称(使用具名插槽)
          template: "isOk"
        },
        {
          label: "排序",
          // 表示将当前列定义为模板页
          type: "template",
          // 表示当前这一列使用的模板名名称(使用具名插槽)
          template: "level"
        },
        {
          label: "操作",
          // 表示将当前列定义为模板页
          type: "template",
          // 表示当前这一列使用的模板名名称(使用具名插槽)
          template: "opt"
        }
      ],
      // 控制添加商品分类弹窗显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 分类的父级id
        cat_pid: 0,
        // 将要添加的分类的名称
        cat_name: '',
        // 当前分类的等级,默认要哦添加的是一级分类
        cat_level: 0
      },
      // 商品分类表单验证规则
      cateFormRules: {
        cat_name: [{ required: true, message: "请添加分类名称", trigger: "blur" }]
      },
      // 所有父级分类的数组
      parentCartList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 显示的属性
        label: 'cat_name',
        // 实际选择的值
        value: 'cat_id',
        children: 'children',
        // 通过hover 触碰到则展开，默认为click
        expandTrigger: 'hover',
        // 取消父子之间的关联，保证能够只选其中之一
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      editCateDialogVisible: false,
      editCateForm: {
        cat_name: '',
        cat_id: ''
      }
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有上平分类列表
    async getCateList() {
      const { data: res } = await getCates(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类信息失败！")
      }
      // console.log(res.data);
      //   把数据列表赋值给 cateList
      this.cateList = res.data.result;
      this.totalCate = res.data.total;
      //  console.log(res);
    },
    // 获取当前在第几页
    handleCurrentChange(newPage) {
      // 因为在动态绑定页码时加了 .sync 后缀，所以会自动同步，所以只需有重新请求数据就行
      this.queryInfo.pagenum = newPage;
      this.getCateList();
      console.log(this.queryInfo);
    },
    handleSizeChange(newSize) {
      // 因为在动态绑定页码时加了 .sync 后缀，所以会自动同步，所以只需有重新请求数据就行(但是加载速度太慢，所以还是在事件中更改)
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 添加分类按钮点击事件
    showAddCateDialog() {
      // 在打开添加分类弹窗之前，先获取到所有的父级分类数据列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await getCates({ type: 2 })
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！")
      }
      // console.log(res);
      this.parentCartList = res.data
    },
    // 选择项发生变化的监听函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      // 如果 selectedKeys 数组中的 length 大于 0，则证明选中了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        // console.log(this.addCateForm.cat_pid);
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormReg.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写分类名！");
        }
        const { data: res } = await addCate(this.addCateForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        // 刷新分类列表
        this.getCateList();
        // 关闭添加分类弹窗
        this.addCateDialogVisible = false;
      })
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClose() {
      // 清空表单
      this.$refs.addCateFormReg.resetFields();
      // 将选择中的父id列表清空
      this.selectedKeys = [];
      // 将添加分类的表单数据对象中的值还原
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 打开编辑分类弹窗时间
    async showEditCateDialog(cat_id) {
      // console.log(cateInfo);
      // 通过 id 查找分类
      const { data: res } = await getCateById(cat_id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询分类失败！");
      }
      // 将该行信息存入editCateForm 对象中
      this.editCateForm.cat_name = res.data.cat_name;
      this.editCateForm.cat_id = res.data.cat_id;
      // 打开弹窗
      this.editCateDialogVisible = true;
    },
    // 点击确定按钮，将编辑分类并提交
    editCate() {
      // console.log(this.editCateForm);
      this.$refs.editCateFormReg.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写分类名称！");
        }
        const { data: res } = await editCate(this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改分类名称失败！");
        }
        this.$message.success("修改分类名称成功！");
        // 刷新 商品分类 数据
        this.getCateList();
        // 关闭编辑弹窗
        this.editCateDialogVisible = false
      })
    },
    // 删除商品分类
    async removeCate(cateId) {
      const confirmResult = await this.$confirm("此操作将永久删除该商品，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info("成功取消该操作！");
      }
      const { data: res } = await removeCate(cateId);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败！");
      }
      this.$message.success("删除商品分类成功！");
      // 刷新 商品分类 数据
      this.getCateList();
      // 关闭编辑弹窗
      this.editCateDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>