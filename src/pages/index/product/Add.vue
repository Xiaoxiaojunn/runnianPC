<template>
  <div id="productApp">
    <h4>商品添加</h4>
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      class="demo-addForm"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="addForm.category" placeholder="请选择商品类型">
          <el-option v-for="item in categories" :key="item.cateName" :value="item.cateName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="addForm.price" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述" prop="goodsDesc">
        <el-input type="textarea" v-model="addForm.goodsDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')">立即创建</el-button>
        <el-button @click="resetForm('addForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_CATEGORIES,API_GOODSADD } from "@/api/apis.js";
export default {
  data() {
    var validatePrice = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error("请输入价格"));
      } else {
        if (this.addForm.price < 1) {
          callback(new Error("最低价格为1"));
        }
        callback();
      }
    };
    return {
      categories: [], //所有商品分类
      imageUrl: "", //页面展示产品图地址
      addForm: {
        name:'',
        category: '',
        price: '1',
        imgUrl: '',
        goodsDesc: '',
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        price: [{ required:true, validator: validatePrice, trigger: "blur" }],
        goodsDesc: [
          { required: true, message: "请输入商品描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw); //页面显示上传图片
      this.addForm.imgUrl = res.imgUrl //后台返给要提交表单的商品图名称
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          API_GOODSADD( this.addForm ).then(res => {
            console.log(res)
            if(res.data.code == 0) {
              this.$message.success("添加成功!")
              this.$refs[formName].resetFields();
            } else {
              this.$message.error("添加失败!")
            }
          }
          )
        } else {
          this.$message.error("添加失败,请稍后添加")
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    API_CATEGORIES().then(res => {
      this.categories = res.data.categories;
    });
  }
};
</script>

<style>
#productApp .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#productApp .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#productApp .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#productApp .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
#productApp .el-form-item__content {
  width: 80%;
}
</style>
<style lang="less" scoped>
#productApp {
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
  }
}
</style>