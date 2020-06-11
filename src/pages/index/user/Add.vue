<template>
  <div class="userAdd">
    <h4>添加账号</h4>
    <el-form :model="addAccountForm" :rules="rules" ref="addAccountForm" label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="addAccountForm.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="addAccountForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userGroup">
        <el-select v-model="addAccountForm.userGroup" placeholder="请选择用户名">
          <el-option value="超级管理员"></el-option>
          <el-option value="普通管理员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addAccountForm')">添加</el-button>
        <el-button @click="resetForm('addAccountForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_ACCOUNTADD } from "@/api/apis.js";
export default {
  data() {
    return {
      flag: true, //防抖节流
      addAccountForm: {
        account: "",
        userGroup: "",
        password: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        userGroup: [
          { required: true, message: "请选择用户名", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.flag) return; //防抖节流
          this.flag = false; //防抖节流
          API_ACCOUNTADD(this.addAccountForm).then(
            res => {
              if (res.data.code == 0) {
                this.$message.success("添加账号成功!");
                setTimeout(() => {
                  this.$router.push("/index/user/list");
                }, 1000);
              } else {
                this.$message.error("添加失败请稍后再试!");
                this.$refs[formName].resetFields(); //清空表单
              }
            }
          );
          setTimeout(() => {
            //防抖节流
            this.flag = true;
          }, 3000);
        } else {
          this.$message.error("添加失败请稍后再试!");
          this.$refs[formName].resetFields(); //清空表单
        }
      });
    },
    //表单清空
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.userAdd {
  h4 {
    font-weight: normal;
    font-size: 16px;
    line-height: 50px;
    background-color: #fff;
    padding-left: 20px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 1px solid #e5e5e5;
    margin: 0;
  }
  .el-form {
    padding: 10px 0;
    background-color: #fff;
    .el-form-item__content .el-input {
      width: 80%;
    }
    .el-textarea {
      width: 80%;
    }
  }
}
</style>