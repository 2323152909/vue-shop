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
          <el-input placeholder="请输入用户名" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 插槽的语法糖写法：# 可代替v-slot, 与v-on可以用@, v-bind可以用 : 一样 -->
          <!-- <template #default="scope"> -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="$refs.addFormRef.resetFields()">
      <!-- 内容主题区域 -->
      <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="100px" show-message class="demo-ruleForm">
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

    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="changeDialogVisible" width="50%" @close="$refs.changeFormReg.resetFields()">
      <!-- 内容主体区域 -->
      <el-form :model="changeForm" :rules="changeFormRules" ref="changeFormReg" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="changeForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="changeForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户：{{currentUserInfo.username}}</p>
        <p>当前的角色：{{currentUserInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userlist, userState, addUsers, getUserInfoById, changeUser, removeUser, setRoleForUser } from "../../network/users";
import { getRoles } from '../../network/power'

export default {
  name: "users",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱！"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        // 合法手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号！"));
    };
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少调数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      handleClose: true,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3, max: 10, message: "用户名长度在 3 到 10 个字符之间", trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6, max: 15, message: "密码长度在 6 到 15 个字符之间", trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }, //正则表达式验证邮箱
          // {type:'email', message:"请输入规范的邮箱号码", trigger:'blur'} //html5新增邮箱验证
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }, //正则表达式验证手机号
          // {type:'tel', message:"请输入规范的邮箱号码", trigger:'blur'} //html5新增电话验证
        ],
      },
      // 存储添加用户信息是否校验通过
      isAddUserValidate: false,
      // 修改用户信息弹窗可视化
      changeDialogVisible: false,
      // 修改用户的表单数据
      changeForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单验证对象
      changeFormRules: {
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }, //正则表达式验证邮箱
        ],
        mobile: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 控制为用户分配角色窗口显示
      setRoleDialogVisible: false,
      // 当前用户信息
      currentUserInfo: {},
      // 所有角色的列表
      rolesList: [],
      // 已经选中的角色roleId 值
      selectedRoleId:''
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
      console.log(res);
      this.userlist = res.data.users;
      this.total = res.data.total;
      // this.$message.success(res.meta.msg);
      // console.log(res);
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
    addUser() {
      // 验证表单输入格式是否正确
      this.$refs.addFormRef.validate(async (valid) => {
        // 表单格式错误，直接返回错误信息
        if (!valid) return this.$message.error("请安正确格式填写注册信息！");
        // 到这，说明信息填写正确，可以调用接口添加用户信息
        const { data: res } = await addUsers(this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("请将信息填写完整！");
        }
        this.$message.success("用户添加成功！");
        // 添加完用户信息，关闭窗口
        this.addDialogVisible = false;
        // 重新获取用户数据列表
        this.getUserList();
      });
    },
    // 显示用于修改信息
    async showEditDialog(uid) {
      console.log(uid);
      const { data: res } = await getUserInfoById(uid);
      console.log(res);
      this.changeDialogVisible = true;
      this.changeForm.username = res.data.username;
      this.changeForm.email = res.data.email;
      this.changeForm.mobile = res.data.mobile;
      this.changeForm.id = res.data.id;
    },
    // 修改用户信息
    changeUserInfo() {
      // 验证表单是否正确
      this.$refs.changeFormReg.validate(async (valid) => {
        // 表单信息错误，直接返回错误提示
        if (!valid) return this.$message.error("请按照正确格式填写信息！");
        const { data: res } = await changeUser(this.changeForm.id, { email: this.changeForm.email, mobile: this.changeForm.mobile });
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("修改用户信息失败！");
        this.$message.success("修改用户信息成功");
        this.changeDialogVisible = false;
        this.getUserList();
      })
    },
    // 删除用户
    delUser(uid) {
      this.$confirm("此操作会永久删除用户，是否继续？", "警告", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await removeUser(uid);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("删除用户失败！");
        this.$message.success("删除用户成功！");
        this.getUserList();
      }).catch(() => {
        this.$message.info("已取消");
      });
    },
    // 为用户分配角色
    async setRole(userInfo) {
      this.currentUserInfo = userInfo;
      // console.log(this.currentUserInfo);

      // 展示对话框之前，获取所有的角色列表
      const { data: res } = await getRoles();
      if (res.meta.status !== 200) {
        return this.$message("获取角色列表失败！")
      }
      console.log(res);
      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    // 保存为用户分配的角色
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error("未选择要分配的角色！")
      }
      const { data:res } = await setRoleForUser(this.currentUserInfo.id, {
        rid: this.selectedRoleId
      });
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error("为用户分配角色失败！");
      }
      this.$message.success("为用户分配角色成功！");
      this.getUserList();

      this.setRoleDialogVisible = false
    },
    // 关闭窗口，将当前用户信息以及所选 id 回归初始值
    setRoleDialogClose(){
      this.currentUserInfo = {};
      this.selectedRoleId = '';
    }
  },
};
</script>

<style lang="less" scoped></style>
