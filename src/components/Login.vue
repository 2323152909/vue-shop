<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from "../network/login";

export default {
  name: "Login",
  data() {
    return {
      // 这是登录表单的数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 这是表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度为3 到 10之间",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入合法密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码在6 到15 个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await getLoginData(this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功！");
        /**
         * 1.将登录成功之后的token，保存到客户端的 sessionStorage 中
         *  1.1 项目中除了登录之外的其他API接口， 必须在登录之后才能访问
         *  1.2 token 只应在当前网站打开期间生效， 所以将token 保存在 sessionStorage中
         */
        sessionStorage.setItem('token', res.data.token);

        /**
         * 2.通过编程式导航跳转到后台主页，路由地址是 /home
         */
        this.$router.push('/home');
      });
    },
    // 点击按钮之后，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  margin: -75px auto;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0px 0px 10px 1px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>