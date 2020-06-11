<template>
  <div id="shops">
    <div class="head">
      <h4>店铺管理</h4>
      <div>
        <el-button size="medium" type="primary" @click="submitForm">保存</el-button>
      </div>
    </div>
    <el-form :model="shopForm" ref="shopForm" label-width="100px" class="demo-shopForm">
      <el-form-item label="店铺名称">
        <el-input v-model="shopForm.name"></el-input>
      </el-form-item>
      <el-form-item label="店铺公告">
        <el-input :rows="6" type="textarea" v-model="shopForm.bulletin"></el-input>
      </el-form-item>
      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:5000/shop/upload"
          :show-file-list="false"
          :on-success="headSuccess"
          :before-upload="headUpload"
        >
          <img v-if="headImageUrl" :src="headImageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="店铺图片">
        <!-- on-preview 文件上传时钩子 文件列表移除文件钩子 -->
        <el-upload
          action="http://127.0.0.1:5000/shop/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="shopSuccess"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="配送费">
        <el-input-number v-model="shopForm.deliveryPrice" :precision="2" :step="1" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-input type="text" v-model="shopForm.deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input type="textarea" v-model="shopForm.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-rate
          v-model="shopForm.score"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        ></el-rate>
      </el-form-item>
      <el-form-item label="销量">
        <el-input-number v-model="shopForm.sellCount" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="活动">
        <el-checkbox-group v-model="shopForm.supports" :min="0" :max="5">
          <el-checkbox v-for="support in supports" :label="support" :key="support"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业时间" required>
        <el-time-picker
          is-range
          v-model="shopForm.date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="hh:mm:ss"
        ></el-time-picker>
      </el-form-item>
      <el-form-item label="起送价格">
        <el-input-number v-model="shopForm.deliveryPrice" :precision="2" :step="1" :min="1"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API_SHOPINFO,API_SHOPEDIT } from "@/api/apis.js";
const supports_option = [
  "在线支付满28减5",
  "VC无限橙果汁全场8折",
  "单人精彩套餐",
  "特价饮品8折抢购",
  "单人特色套餐"
];
export default {
  data() {
    return {
      pics: [], //后台需要的店铺图片数组格式
      fileList: [],
      supports: supports_option,
      shopForm: {
        //初始化未空数组不然dom中绑定shopForm.supports在没拿到数据时,报错length
        supports: []
      },

      headImageUrl: "",

      dialogImageUrl: "",
      dialogVisible: false,

      price: 1,
      sales: 255,
      score: 1.5
    };
  },
  methods: {
    //保存
    submitForm() {
      this.shopForm.pics = JSON.stringify(this.pics);
      this.shopForm.date = JSON.stringify(this.shopForm.date);
      this.shopForm.supports = JSON.stringify(this.shopForm.supports)
      let {
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      } = this.shopForm;
      console.log({
        id,
        name,
        bulletin,
        avatar,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      });
      API_SHOPEDIT( { id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics }).then(res => {
        if (res.data.code == 0) {
          this.$message.success("编辑成功")
        } else {
          this.$message.error("编辑失败,请稍后编辑")
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    headSuccess(res, file) {
      this.headImageUrl = URL.createObjectURL(file.raw);
      this.shopForm.avatar = res.imgUrl;
    },
    shopSuccess(res, file) {
      this.dialogImageUrl = URL.createObjectURL(file.raw);
      this.pics.push(file.response.imgUrl);
    },
    headUpload(file) {
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

    handleRemove(file, fileList) {
      console.log(file, fileList);
      // this.shopForm.pics.indexOf(res.file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    getList() {
      API_SHOPINFO().then(res => {
        if (res) {
          console.log(res);
          this.shopForm = res.data.data;
          this.headImageUrl =
            "http://127.0.0.1:5000/upload/shop/" + res.data.data.avatar;
          this.pics = res.data.data.pics.map(item => {
            //店铺图片展示
            this.fileList.push({
              url: "http://127.0.0.1:5000/upload/shop/" + item
            });
            return item;
          });
          this.shopForm.date = [res.data.data.date[0],res.data.data.date[1]]
        }
      });
    },

    //时间戳转化格式yyyy-mm-dd hh:mm:ss
    filterDate(dataStr) {
      var time = new Date(dataStr);

      function timeAdd0(str) {
        if (str < 10) {
          str = "0" + str;
        }
        return str;
      }
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        timeAdd0(m) +
        "-" +
        timeAdd0(d) +
        " " +
        timeAdd0(h) +
        ":" +
        timeAdd0(mm) +
        ":" +
        timeAdd0(s)
      );
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style>
#shops .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#shops .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#shops .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#shops .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="less" scoped>
#shops {
  .head {
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    padding-left: 20px;
    padding-right: 20px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      font-weight: normal;
      font-size: 16px;
      margin: 0;
    }
  }
  .el-form {
    padding: 10px 0;
    background-color: #fff;
    width: 100%;
    .el-form-item__content .el-input {
      width: 80%;
    }
    .el-textarea {
      width: 80%;
    }
  }
}
</style>