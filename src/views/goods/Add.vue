<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 顶部提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" align-center :active="parseInt(activeIndex)" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form表单区域 -->
      <el-form label-position="top" :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormReg" label-width="100px">
        <!-- tabs 栏区域 -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">

          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cateList" :props="catProps" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item项目 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableList" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, index) in item.attr_vals" :key="index" border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" />

            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import { getCates, getParams, addGoods } from '../../network/goods'
// 导入lodash包，将其命名为 _
import _ from 'lodash'

export default {
  name: "add",
  data() {
    return {
      activeIndex: '0',
      // 添加商品表单数据
      addGoodsForm: {
        goods_name: '',
        // 商品所属分类数组
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品详情介绍
        goods_introduce: '',
        // 商品的数组
        pics: [],
        attrs: []
      },
      // 添加商品表单的验证规则
      addGoodsFormRules: {
        goods_name: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请填写商品价格", trigger: "blur" }],
        goods_number: [{ required: true, message: "请填写商品重量", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请填写商品数量", trigger: "blur" }],
        goods_introduce: [{ required: true, message: "请填写商品介绍", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "select" }]
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器对象
      catProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表数据
      manyTableList: [],
      // 静态属性列表数据
      onlyTableList: [],
      // 上传图片的url地址
      uploadURL: "http://120.77.221.77:8888/api/private/v1/upload",
      // 配置图片上传请求头
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
      // 控制图片预览弹窗的显示与隐藏
      previewVisible: false
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await getCates();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }
      this.cateList = res.data
      // console.log(this.cateList);
    },
    // 级联选择器选中项，会触发次函数
    handleChange() {
      // 数组长度小于三，则说明不是三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return this.addGoodsForm.goods_cat = [];
      }
      // console.log(this.addGoodsForm.goods_cat);
    },
    // 在 tab栏发生点击切换之前，调用该监听函数
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页：'+oldActiveName);
      // console.log('即将进入的标签页：'+activeName);
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！")
        return false;
      }
    },
    // 获取动态参数/静态属性的函数，调用该函数就能获取动态参数/静态属性，需传入rel说明动态还是静态
    async getParams(sel) {
      const { data: res } = await getParams(this.cateId, { sel: sel });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败！");
      }

      // console.log(res.data);
      return res.data;
    },
    // tab被点击是触发该监听函数
    async tabClicked() {
      // console.log(this.activeIndex);
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        // 获取动态参数, 并将动态参数列表存入 data中
        const res = await this.getParams('many');
        res.forEach(item => {
          // 判断属性值 attr_vals是否是空字符串,不是空字符串，则将字符串以逗号分割为一个数组,是空字符串，则返回一个空字符串
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
        });
        this.manyTableList = res;
        console.log(this.manyTableList);
      } else if (this.activeIndex === '2') {
        // 获取静态属性, 并将静态属性列表存入data中
        this.onlyTableList = await this.getParams('only');
        console.log(this.onlyTableList);
      }
    },
    // 处理图片预览事件
    handlePreview(file) {
      console.log(file);
      // this.previewPath = file.response.data.url; //该图片地址我们无法访问，这是云服务器中存储图片的地址，我们需要用另一个地址进行访问
      this.previewPath = file.url;
      // 图片预览对话框展示
      this.previewVisible = true;
    },
    // 处理图片移除事件
    handleRemove(file) {
      // console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到这个图片对应的索引值
      const index = this.addGoodsForm.pics.findIndex((x) => x.pic === filePath);
      // console.log(index);
      // 3.调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addGoodsForm.pics.splice(index, 1);
      // console.log(this.addGoodsForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象push到pics数组中
      this.addGoodsForm.pics.push(picInfo);
      // console.log(this.addGoodsForm);
    },
    // 点击按钮，添加商品
    add() {
      // 验证表单规则是否满足
      this.$refs.addGoodsFormReg.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请将商品基本信息填写完整！");
        }
        // 执行添加的业务逻辑
        // lodash cloneDeep(obj)深拷贝
        const form = _.cloneDeep(this.addGoodsForm);
        form.goods_cat = form.goods_cat.join(',');
        console.log(this.manyTableList);
        console.log(this.onlyTableList);

        // 处理动态参数
        this.manyTableList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addGoodsForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo);
        });

        form.attrs = this.addGoodsForm.attrs;
        console.log(form);

        // 调用接口添加商品
        const { data: res } = await addGoods(form);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("商品添加失败！");
        }
        this.$message.success("商品添加成功！");
        // 添加完商品，跳转到 goods商品页面中
        this.$router.push('/goods');
      })
    }
  },
  computed: {
    // 计算属性，返回三级分类的cateId
    cateId() {
      // 判断是否为三级分类
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1];
      }
      return null;
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 20px;
}
</style>