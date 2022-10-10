<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 头部的警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateLists" :props="cateProps" @change="selectCateChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tabs 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="props">
                <!-- 循环渲染tag标签 -->
                <el-tag closable v-for="(item, index) in props.row.attr_vals" :key="index" @close="handleClose(index, props.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model="props.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)" @blur="handleInputConfirm(props.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template v-slot="props">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(props.row.attr_id)">修改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(props.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData"  stripe border>
            <!-- 继承列 -->
            <el-table-column type="expand">
              <template v-slot="props">
                <!-- 循环渲染tag标签 -->
                <el-tag closable v-for="(item, index) in props.row.attr_vals" :key="index" @close="handleClose(index, props.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model="props.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)" @blur="handleInputConfirm(props.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 参数名称列 -->
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template v-slot="props">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(props.row.attr_id)">修改</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(props.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数或属性的对话框 -->
    <el-dialog :title="'添加'+dialogText" :visible.sync="addDialogVisible" width="50%" @close="addDialogVisibleClose">
      <!-- 添加参数/属性表单 -->
      <el-form :model="addParamsForm" :rules="paramsFormRules" ref="addParamsFormReg" label-width="100px">
        <el-form-item :label="dialogText+'：'" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数或属性的对话框 -->
    <el-dialog :title="'添加'+dialogText" :visible.sync="editDialogVisible" width="50%" @close="editDialogVisibleClose">
      <!-- 修改参数/属性表单 -->
      <el-form :model="editParamsForm" :rules="paramsFormRules" ref="editParamsFormReg" label-width="100px">
        <el-form-item :label="dialogText+'：'" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCates, getParams, addParams, getParamsById, editParams, removeParams } from '../../network/goods'

export default {
  name: 'params',
  data() {
    return {
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      //   商品分类列表
      cateLists: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活的页签的名称，默认为first
      activeName: "many",
      // 控制添加参数/属性对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数/属性的表单对象
      addParamsForm: {
        attr_name: ''
      },
      // 表单验证规则
      paramsFormRules: {
        attr_name: { required: true, message: "请填写参数名称", trigger: "blur" }
      },
      // 控制修改参数/属性的对话框显示与隐藏
      editDialogVisible: false,
      editParamsForm: {
        attr_name: '',
        attr_id: 0
      },
    }
  },
  created() {
    this.getCatesList();
  },
  methods: {
    //   获取所有的商品分类列表
    async getCatesList() {
      const { data: res } = await getCates();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      // console.log(res);
      this.cateLists = res.data;
      // console.log(this.cateLists);
    },
    // 级联选择框变化会触发该函数
    selectCateChange() {
      this.getParamsList();
    },
    // 点击tab 标签页切换
    handleTabClick() {
      // 切换时调用 获取商品分类参数列表进行重新获取
      this.getParamsList();
    },
    // 获取商品分类参数列表
    async getParamsList() {
      // 只能选择三级分类，如果不是三级分类，就将其选择清空
      // 反之则保留
      if (this.selectedCateKeys.length !== 3) {
        // 证明选择的不是三级分类
        this.selectedCateKeys = [];
        // 清空参数表格
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 能到这，证明是三级分类
      const { data: res } = await getParams(this.cateId, {
        sel: this.activeName
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类参数失败！");
      }
      res.data.forEach(item => {
        // 通过三元表达式判断字符串是否为空，不为空则以将其空格进行分割为一个数组，为空则返回一个空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];

        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = '';
      });
      console.log(res);

      // 判断请求到的是动态参数还是静态属性，将其分别放在不同的数组中
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听添加对话框关闭事件
    addDialogVisibleClose() {
      // 清空添加对话框表单数据
      this.$refs.addParamsFormReg.resetFields();
    },
    // 监听确定按钮，添加参数
    addParams() {
      this.$refs.addParamsFormReg.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写表单数据！");
        }
        const { data: res } = await addParams(this.cateId, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(`添加${this.dialogText}失败！`);
        }
        this.$message.success(`添加${this.dialogText}成功！`);
        this.getParamsList();
        this.addDialogVisible = false;
      })
    },
    // 点击按钮，展示修改对话框
    async showEditDialog(attr_id) {
      this.editParamsForm.attr_id = attr_id;
      const { data: res } = await getParamsById(this.cateId, attr_id, {
        attr_sel: this.activeName
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(`获取${this.dialogText}失败！`);
      };
      this.editParamsForm.attr_name = res.data.attr_name;
      this.editDialogVisible = true
    },
    // 监听编辑参数对话框关闭事件
    editDialogVisibleClose() {
      // 重置修改参数的表单
      this.$refs.editParamsFormReg.resetFields();
    },
    // 编辑参数操作
    editParams() {
      this.$refs.editParamsFormReg.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写表单数据！");
        }
        const { data: res } = await editParams(this.cateId, this.editParamsForm.attr_id, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName
        })
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(`修改${this.dialogText}失败！`);
        }
        this.$message.success(`修改${this.dialogText}成功！`);
        this.getParamsList();
        this.editDialogVisible = false;
      })
    },
    // 删除参数
    async removeParams(paramsInfo) {
      // console.log(paramsInfo);
      const confirmResult = await this.$confirm("该操作将永久删除该商品参数，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("成功取消删除！");
      }
      const { data: res } = await removeParams(this.cateId, paramsInfo.attr_id)
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(`删除${this.dialogText}失败！`);
      }
      this.$message.success(`删除${this.dialogText}成功！`);
      this.getParamsList();
    },
    // 文本框失去焦点，或按下了 Enter 键会触发的监听函数
    handleInputConfirm(rowInfo) {
      console.log("ok");
      if (rowInfo.inputValue.trim().length === 0) {
        rowInfo.inputValue = '',
          rowInfo.inputVisible = false;
        return;
      }
      // 如果没有 return 则说明输入的内容，需要渲染到页面中
      // 将输入的值 push 压入attr_vals 数组中进行渲染
      rowInfo.attr_vals.push(rowInfo.inputValue);
      // 渲染完成之后清空输入框，并关闭输入框
      rowInfo.inputValue = '';

      // 通过调用编辑标签函数发送网络请求
      this.saveAttrVals(rowInfo);

      // 关闭文本输入框
      rowInfo.inputVisible = false;
    },
    async saveAttrVals(rowInfo) {
      // console.log(rowInfo.attr_vals.join(','));
      // 需要发起网络请求，将该数据保存到数据库中
      const { data: res } = await editParams(rowInfo.cat_id, rowInfo.attr_id, {
        attr_name: rowInfo.attr_name,
        attr_sel: rowInfo.attr_sel,
        // 将attr_vals 数组的转换为以, 进行分割的字符串
        attr_vals: rowInfo.attr_vals.join(',')
      });
      if (res.meta.status !== 200) {
        // 如果请求编辑提交失败，则将刚刚压入 attr_vals数组的值从数组中删掉
        rowInfo.attr_vals.pop();
        return this.$message.error("编辑提交参数失败！");
      }
      this.$message.success("编辑提交参数成功！");
    },
    // 控制输入文本框的显示与隐藏
    showInput(rowInfo) {
      rowInfo.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 通过 tag标签索引删除参数的标签的监听函数
    async handleClose(index, rowInfo) {
      // 因为删除操作不可逆，所以需要提心用户是否确定，以防止误删操作
      const confirmResult = await this.$confirm("该操作将永久删除该标签，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err)
      if (confirmResult !== "confirm") {
        return this.$message.info("成功取消该操作！");
      }
      // 用户确认删除，则通过 index索引 取出并删掉该标签
      const newVals = rowInfo.attr_vals.splice(index, 1);
      console.log(newVals);
      // console.log(rowInfo);

      // 调用 编辑提交tag 标签函数，发送网络请求，将删除的标签从数据库中删除
      this.saveAttrVals(rowInfo);
    }
  },
  computed: {
    // 是否选中三级商品分类，用来控制添加参数按钮是否能够点击
    isBtnDisabled() {
      // 判断是否选中的是三级分类，返回一个布尔值
      return this.selectedCateKeys.length !== 3;
    },
    // 当前选中的三级分类的id
    cateId() {
      // 判断是否为三级分类商品
      if (this.selectedCateKeys.length === 3) {
        // 返回三级分类的 分类id
        return this.selectedCateKeys[this.selectedCateKeys.length - 1];
      }
      return null;
    },
    // 弹窗中数据文本
    dialogText() {
      if (this.activeName === 'many') {
        return "动态参数"
      } else {
        return "静态属性"
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 150px;
}
</style>