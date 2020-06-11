<template>
  <div class="userEdit">
    <h4>修改密码</h4>
    <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="100px">
      <el-form-item label="原密码" prop="oldPwd">
        <el-input
          placeholder="请输入密码"
          v-model="passwordForm.oldPwd"
          show-password
          @blur="validateOldPwd"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input placeholder="请输入密码" v-model="passwordForm.newPwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpwd">
        <el-input placeholder="请输入密码" v-model="passwordForm.checkpwd" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passwordForm')">确定</el-button>
        <el-button @click="resetForm('passwordForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_CHECKOLDPWD, API_EDITPWD } from "@/api/apis.js";
export default {
  data() {
    var validateOldPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        if (this.passwordForm.newPwd !== "") {
          this.$refs.passwordForm.validateField("newPwd");
        }
        callback();
      }
    };
    var validateNewPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.checkpwd !== "") {
          this.$refs.passwordForm.validateField("checkpwd");
        }
        callback();
      }
    };
    var validateChickPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        oldPwd: "",
        newPwd: "",
        checkpwd: ""
      },
      rules: {
        oldPwd: [{ validator: validateOldPwd, trigger: "blur" }],
        newPwd: [{ validator: validateNewPwd, trigger: "blur" }],
        checkpwd: [{ validator: validateChickPwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          API_CHECKOLDPWD({
            oldPwd: this.passwordForm.oldPwd,
            id: localStorage.id
          }).then(res => {
            if (res.data.code == 0) {
              API_EDITPWD({
                id: localStorage.id,
                newPwd: this.passwordForm.newPwd
              }).then(res => {
                if (res.data.code == 0) {
                  this.$message.success("密码修改成功!");
                  this.$refs[formName].resetFields();
                } else {
                  this.$message.error("密码修改失败,请稍后再试");
                }
              });
            } else {
              this.$message.error("旧密码不正确请重新输入");
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    validateOldPwd() {
      console.log(123);
    }
  }
};
</script>

<style lang="less" scoped>
.userEdit {
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