<template>
  <div class="userList">
    <h4>商品分类</h4>
    <div class="user-table">
      <el-table
        ref="multipleTable"
        :data="accountList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="姓名" width="120"></el-table-column>
        <el-table-column prop="userGroup" label="用户组" show-overflow-tooltip></el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.ctime | dateFilter }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="clickShowEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="clickShowdel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="clickShowdelAll">批量删除</el-button>
        <el-button type="danger" @click="toggleSelection">取消选择</el-button>
      </div>
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
    <Dialog :dialogOption="dialogOption" @editClick="editClick"></Dialog>
  </div>
</template>

<script>
import {
  API_USERLIST,
  API_ACCOUNTDEL,
  API_ACCOUNTDELALL,
  API_ACCOUNTEDIT
} from "@/api/apis.js";
import Dialog from "@/components/Dialog.vue";
export default {
  filters: {
    dateFilter: val => {
      //时间戳转××××-××-××
      return val.substr(0, 10);
    }
  },
  components: {
    Dialog
  },
  methods: {
    //编辑提示弹窗
    clickShowEdit(item) {
      this.olddata_edit = JSON.parse(JSON.stringify(item)); //获取编辑前数据 比对后面是否改动 改动了就调用编辑数据接口,没有则提示
      this.dialogOption = {
        title: "提示",
        text: "是否批量删除?",
        summit: "editClick",
        params: item,
        type: "table",
        dialog: true //调用公共组件dialog开关
      };
    },

    //编辑确定
    editClick() {
      for (let item in this.dialogOption.params) {
        //for in 遍历对象比对 有改动 掉接口 未改动 提示
        if (this.olddata_edit[item] != this.dialogOption.params[item]) {
          this.dialogOption.dialog = false; //关闭公共组件dialog开关
          let { id, account, userGroup } = this.dialogOption.params;
          API_ACCOUNTEDIT({ id, account, userGroup }).then(res => {
            if (res.data.code == 0) {
              this.getList();
              this.$message.success("编辑成功!");
            } else {
              this.$message.error("编辑失败!");
            }
          });
          return;
        }
      }
      this.$message.error("未修改数据!");
    },

    //批量删除提示
    clickShowdelAll() {
      if(!this.selectedData || this.selectedData.length === 0) {
        this.$message.error("未选择要删除数据!")
        return
      }
      this.$confirm("此操作将永久删除选中账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_ACCOUNTDELALL({ ids: JSON.stringify(this.selectedData.map(item => item.id)) }).then(res => {
            if (res.data.code == 0) {
              this.getList();
              this.$message.success("批量删除成功!");
            } else {
              this.$message.error("批量删除失败!");
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

    //单删除提示
    clickShowdel(id) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_ACCOUNTDEL({ id }).then(res => {
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

    //获取表格数据
    getList() {
      API_USERLIST({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res) {
          this.accountList = res.data.data;
          this.total = res.data.total;
        }
      });
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

    //取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //选中数据获取
    handleSelectionChange(val) {
      this.selectedData = val; //选中数据
    }
  },

  data() {
    return {
      dialogOption: {
        //弹窗配置
      },
      input:'',

      accountList: [],
      total: null,
      currentPage: 1,
      pageSize: 10,

      selectedData: [], //选中表格数据
      ids: [], //多删id
      olddata_edit: {}
    };
  },
  created() {
    this.getList(); //获取账号列表
  }
};
</script>

<style lang="less" scoped>
.userList {
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
  .user-table {
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