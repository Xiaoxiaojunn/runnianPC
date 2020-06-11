<template>
  <div id="productList">
    <h4>商品列表</h4>
    <div class="product-table">
      <el-table :data="product_list" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <img
                  width="50"
                  :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+props.row.imgUrl"
                  alt
                />
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="所属分类" prop="category"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="商品图片" prop="imgUrl">
          <template slot-scope="scope">
            <img
              width="40"
              :src="'http://127.0.0.1:5000/upload/imgs/goods_img/'+ scope.row.imgUrl"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="clickShowEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="clickShowdel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 编辑窗口 -->
    <el-dialog title="修改商品" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="newdata_edit" :rules="rules" ref="newdata_edit" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="newdata_edit.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="newdata_edit.category" placeholder="请选择商品类型">
            <el-option v-for="item in categories" :key="item.cateName" :value="item.cateName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="newdata_edit.price" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="newdata_edit.imgUrl" :src="newdata_edit.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <el-input type="textarea" v-model="newdata_edit.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickEdit('newdata_edit')">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  API_GOODSLIST,
  API_GOODSDEL,
  API_CATEGORIES,
  API_GOODSEDIT
} from "@/api/apis.js";
export default {
  methods: {
    //监听弹窗关闭
    handleClose() {
      this.olddata_edit = {}; //编辑前的数据初始化
      this.newdata_edit = {}; //编辑后的据初始化
    },

    //监听分页数据数量
    handleSizeChange(val) {
      //val每页条数
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },

    //监听分页页码
    handleCurrentChange(val) {
      //当前页
      this.currentPage = val;
      this.getList();
    },

    //单删除提示
    clickShowdel(id) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_GOODSDEL({ id }).then(res => {
            if (res.data.code == 0) {
              this.getList();
              this.$message.success("删除成功!");
            } else {
              this.$message.error("删除失败!");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //编辑提示
    clickShowEdit(item) {
      this.newdata_edit = JSON.parse(JSON.stringify(item));
      this.olddata_edit = JSON.parse(JSON.stringify(item));
      this.imageUrl = item.imgUrl; //编辑窗图片展示的地址和提交给后台的图片地址不一样 所以点击编辑时,先存下需要提交的地址
      this.newdata_edit.imgUrl =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + item.imgUrl; //编辑弹窗展示图片加前缀
      this.olddata_edit.imgUrl =
        "http://127.0.0.1:5000/upload/imgs/goods_img/" + item.imgUrl; //比对
      this.dialogFormVisible = true;
      API_CATEGORIES().then(res => {
        this.categories = res.data.categories;
      });
    },

    //编辑确定
    clickEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //比对是否修改
          for (let i in this.newdata_edit) {
            if (this.newdata_edit[i] != this.olddata_edit[i]) {
              //修改后数据跟修改前数据有不同则可以调后台修改接口
              this.newdata_edit.price = String(this.newdata_edit.price);
              var { name, category, price, goodsDesc, id } = this.newdata_edit;
              API_GOODSEDIT({
                name,
                category,
                price,
                goodsDesc,
                id,
                imgUrl: this.imageUrl
              }).then(res => {
                if (res.data.code == 0) {
                  this.dialogFormVisible = false;
                  this.$message.success("修改成功!");
                  this.getList();
                } else {
                  this.$message.error("修改失败,请稍后再试!");
                }
              });
              return
            } 
          }
          this.$message.error("未修改内容!")
        } else {
          this.$message.error("请填写完整");
          return false;
        }
      });
    },

    handleAvatarSuccess(res, file) {
      this.newdata_edit.imgUrl = URL.createObjectURL(file.raw); //页面显示上传图片
      this.imageUrl = res.imgUrl; //后台返给要提交表单的商品图名称
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

    //获取表格数据
    getList() {
      API_GOODSLIST({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res) {
          this.product_list = res.data.data;
          this.total = res.data.total;
        }
      });
    }
  },
  created() {
    this.getList();
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入价格"));
      } else {
        if (this.newdata_edit.price < 1) {
          callback(new Error("最低价格为1"));
        }
        callback();
      }
    };
    return {
      currentPage: 1,
      pageSize: 10,
      total: null,
      product_list: [],

      olddata_edit: {}, //获取修改前数据比对修改后数据 未修改不提交后台
      newdata_edit: {},

      dialogFormVisible: false,
      imageUrl: "",
      categories: [],

      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        price: [{ required: true, validator: validatePrice, trigger: "blur" }],
        goodsDesc: [
          { required: true, message: "请输入商品描述", trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
#productList {
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
  .product-table {
    padding: 10px;
    border-radius: 3px;
    background-color: #fff;
    img {
      border-radius: 4px;
    }
  }
  .el-dialog {
    img {
      width: 140px;
      height: 140px;
    }
  }
  .pages {
    background-color: #fff;
    padding: 10px;
  }
}
</style>