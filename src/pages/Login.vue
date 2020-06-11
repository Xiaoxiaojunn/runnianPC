<template>
  <div id="login">
    <div class="login-box">
      <h2>润年订单管理系统</h2>
      <div class="login-form">
        <div class="group-input">
          <el-input placeholder="请输入内容" v-model="account" clearable></el-input>
          <i class="el-icon-user"></i>
          <span class="err" v-show="userfalg">请填写用户名</span>
        </div>
        <div class="group-input">
          <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
          <i class="el-icon-lock"></i>
          <span class="err" v-show="pwdfalg">请填写密码</span>
        </div>
        <div class="login-div">
          <el-button type="primary" @click="loginClick">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_LOGIN } from "@/api/apis.js";
export default {
  data() {
    return {
      flag: true, //登陆防抖flag
      account: "",
      password: "",
      userfalg: false,
      pwdfalg: false
    };
  },
  methods: {
    loginClick() {
      if (!this.account.trim()) {
        this.userfalg = true;
        return;
      } else {
        this.userfalg = false;
      }
      if (!this.password.trim()) {
        this.pwdfalg = true;
        return;
      } else {
        this.pwdfalg = false;
      }
      if (!this.flag) return; //防抖节流
      this.flag = false; //防抖节流
      API_LOGIN({ account: this.account, password: this.password }).then(
        res => {
          if (res.data.code == 0) {
            localStorage.id = res.data.id;
            localStorage.role = res.data.role;
            localStorage.token = res.data.token;
            localStorage.account = this.account;
            this.$message.success("登录成功!");
            setTimeout(() => {
              this.$router.push("/index/home");
            }, 1000);
          } else {
            this.$message.error("用户名不存在或密码错误!");
          }
        }
      );
      setTimeout(() => {
        //防抖节流
        this.flag = true;
      }, 3000);
    }
  }
};
</script>

<style>
#login .el-input__inner {
  padding-left: 40px;
}
</style>
<style lang="less" scoped>
#login {
  width: 100%;
  height: 100%;
  background-color: #2d3a4b;
  .login-box {
    width: 320px;
    margin: 0 auto;
    padding-top: 160px;
    h2 {
      text-align: center;
      color: #fff;
      line-height: 80px;
      font-size: 22px;
      margin: 0;
    }
    .login-form {
      .group-input {
        position: relative;
        margin-bottom: 26px;
        i {
          position: absolute;
          top: 0;
          left: 10px;
          font-size: 18px;
          line-height: 40px;
          color: #999;
        }
        .err {
          color: red;
          font-size: 12px;
          position: absolute;
          bottom: -16px;
          line-height: 12px;
          left: 0px;
        }
      }
      .login-div {
        margin-bottom: 20px;
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>