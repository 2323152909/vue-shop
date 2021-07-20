<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="50">
        <el-col :span="10">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入用户名"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="状态">
          <!-- 插槽的语法糖写法：# 可代替v-slot, 与v-on可以用@, v-bind可以用 : 一样 -->
          <!-- <template #default="scope"> -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="$refs.addFormRef.resetFields()">
      <!-- 内容主题区域 -->
      <el-form
        :rules="addFormRules"
        :model="addForm"
        ref="addFormRef"
        label-width="100px"
        show-message
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userlist, userState, addUsers } from "../../network/users";

export default {
  name: "users",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
      if(regEmail.test(value)){
        // 合法邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱！"));
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(regMobile.test(value)){
        // 合法手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号！"));
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少调数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      handleClose: true,
      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单验证规则对象
      addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 个字符之间', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {type:'email', message:"请输入规范的邮箱号码", trigger:'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur', }
          ],
      },
      // 存储添加用户信息是否校验通过
      isAddUserValidate:false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 异步获取用户数据
    async getUserList() {
      const { data: res } = await userlist(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userlist = res.data.users;
      this.total = res.data.total;
      // this.$message.success(res.meta.msg);
      console.log(res);
    },
    // 监听pagesize（每页多少条数据）改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      // 每页数据条数改变，重新请求数据
      this.getUserList();
    },
    // 监听页码值（当前页码）改变得事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      // 再次请求数据
      this.getUserList();
    },
    // 监听用户状态改变
    async userStateChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await userState(userInfo.id, userInfo.mg_state);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
      console.log(res);
    },
    // 添加按钮，添加新用户
    async addUser(){
      // 验证表单输入格式是否正确
      this.$refs.addFormRef.validate((valid) => {
        this.isAddUserValidate = valid
      })
      // 表单格式错误，直接返回错误信息
      if(!this.isAddUserValidate) return this.$message.error("请安正确格式填写注册信息！")
      // 到这，说明信息填写正确，可以调用接口添加用户信息
      const { data:res } = await addUsers(this.addForm);
      console.log(res);
      if(res.meta.status !== 201){
        return this.$message.error("请将信息填写完整！")
      }
      this.$message.success("用户添加成功！")
      // 添加玩用户信息，关闭窗口
      this.addDialogVisible = false
      
      // console.log(this.isAddUserValidate);
    }
  },
};
</script>

<style lang="less" scoped></style>
