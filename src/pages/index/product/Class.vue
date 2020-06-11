<template>
  <div class="productClass">
    <!-- 添加 -->
    <el-dialog title="添加分类" :visible.sync="addDialog">
      <el-form :model="add_form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="add_form.cateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="add_form.state"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="clickAdd">确 定</el-button>
      </div>
    </el-dialog>

    <div class="head">
      <h4>商品分类</h4>
      <el-button type="primary" size="medium" @click="clickShowAdd">添加分类</el-button>
    </div>
    <div class="product-table">
      <el-table :data="class_list" style="width: 100%">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column prop="cateName" label="分类名称">
          <template slot-scope="scope">
            <el-input v-show="scope.row.flag" v-model="scope.row.cateName"></el-input>
            <span v-show="!scope.row.flag">{{ scope.row.cateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="180">
          <template slot-scope="scope">
            <el-switch :disabled="!scope.row.flag" 
            v-model="scope.row.state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-show="!scope.row.flag"
              size="mini"
              @click="clickEditShow(scope.row,scope.$index)"
            >编辑</el-button>
            <el-button
              v-show="scope.row.flag"
              size="mini"
              type="success"
              @click="clickEdit(scope.row)"
            >完成</el-button>
            <el-button size="mini" type="danger" @click="clickDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- 弹窗 -->
    <Dialog :dialogOption="dialogOption" @clickAdd="clickAdd"></Dialog>
  </div>
</template>

<script>
import {
  API_ADDCATE,
  API_CATELIST,
  API_DELCATE,
  API_EDITCATE
} from "@/api/apis.js";
import Dialog from "@/components/Dialog.vue";
export default {
  components: {
    Dialog
  },
  methods: {
    //添加弹框出现
    clickShowAdd() {
      this.add_form = {
        //添加弹窗数据初始化
        cateName: "",
        state: true
      };
      this.addDialog = true; //打开弹窗
    },

    //添加分类
    clickAdd() {
      if (!this.add_form.cateName.trim()) {
        this.$message.error("请输入分类名!");
        return;
      }
      this.addDialog = false; //关闭弹窗
      this.add_form.state = String(this.add_form.state);
      API_ADDCATE(this.add_form).then(res => {
        if (res.data.code == 0) {
          this.getList();
          this.$message.success("添加成功!");
        } else {
          this.$message.error("添加失败,请稍后再试!");
        }
      });
    },

    //获取分类
    getList() {
      API_CATELIST({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res) {
          res.data.data.forEach(item => {
            item["flag"] = false;
            item.state = item.state ? true : false;
          });
          this.class_list = res.data.data;
          this.total = res.data.total;
        }
      });
    },

    clickDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_DELCATE({ id }).then(res => {
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

    //修改
    clickEdit(item) {
      //判断是否修改
      if (
        item.cateName != this.old_editdata.cateName ||
        item.state != this.old_editdata.state
      ) {
        API_EDITCATE({
          id: item.id,
          cateName: item.cateName,
          state: String(item.state)
        }).then(res => {
          if (res.data.code == 0) {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败请稍后再试!");
          }
          this.getList();
        });
      } else {
        this.$message.error("数据未修改!");
      }
    },

    //编辑出现
    clickEditShow(item, index) {
      //存储修改前数据 比对修改后 比对是否修改
      this.old_editdata = JSON.parse(JSON.stringify(item));
      this.class_list[index].flag = true;
    },

    handleSizeChange(val) {
      //val每页条数
      this.pageSize = val;
      this.getList();
    },

    handleCurrentChange(val) {
      //当前页
      this.currentPage = val;
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  data() {
    return {
      dialogOption: {}, //模态框参数配置

      total: null,
      currentPage: 1,
      pageSize: 10,

      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,

      addDialog: false,
      add_form: {}, //分类添加数据
      old_editdata: {}, //修改前数据
      formLabelWidth: "120px",

      class_list: [] //表格数据
    };
  }
};
</script>

<style lang="less" scoped>
.productClass {
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

  .product-table {
    padding: 10px;
    border-radius: 3px;
    background-color: #fff;
  }
  .pages {
    background-color: #fff;
    padding: 10px;
  }
}
</style>