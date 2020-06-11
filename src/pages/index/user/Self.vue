<template>
  <el-card class="box-card">
    <div slot="header" class="header clearfix">
      <span>管理员信息</span>
      <el-button type="primary" @click="$router.push('/index/product/list')">编辑信息</el-button>
    </div>
    <el-row>
      <el-col :span="2">
        <label>管理员ID:</label>
      </el-col>
      <el-col :span="22">
        <span>{{ userlist.id }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <label>账号:</label>
      </el-col>
      <el-col :span="22">
        <span>{{ userlist.account }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <label>用户组:</label>
      </el-col>
      <el-col :span="22">
        <span>{{ userlist.userGroup }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <label>创建时间:</label>
      </el-col>
      <el-col :span="22">
        <span>{{ userlist.ctime | dateFilter }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <label>管理员头像:</label>
      </el-col>
      <el-col :span="22">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/users/avatar_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="id"
          :auto-upload="true"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { API_ACCOUNTINFO } from "@/api/apis.js";
export default {
  data() {
    return {
      id: { id: localStorage.id },
      imageUrl: "",
      userlist: {} //表单数据
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message.success("修改成功!");
      window.location.reload(); //刷新
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isJPG && isLt3M;
    }
  },
  filters: {
    dateFilter: val => {
      if (val) {
        //时间戳转××××-××-××
        return val.substr(0, 10);
      }
    }
  },
  created() {
    API_ACCOUNTINFO({ id: 55 }).then(res => {
      if (res) {
        this.userlist = res.data.accountInfo;
        this.imageUrl = res.data.accountInfo.imgUrl;
      }
    });
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="less" scoped>
.box-card {
  .header {
    display: flex;
    justify-content: space-between;
  }
  .el-row {
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    padding-bottom: 20px;
    padding-top: 20px;
    &:last-child {
      border-bottom: none;
    }
    &:first-child {
      padding-top: 0;
    }
    .avatar {
      width: 100px;
      height: 100px;
    }
  }
}

img {
  vertical-align: middle;
}
</style>