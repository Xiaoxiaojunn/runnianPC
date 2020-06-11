<template>
  <div id="order">
    <div class="order-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="orderNo"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="consignee"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="phone"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="orderState">
            <el-option value="已受理"></el-option>
            <el-option value="派送中"></el-option>
            <el-option value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间">
          <div class="block">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="orderData" border style="width: 100%">
        <el-table-column fixed prop="orderNo" label="订单号" width="100"></el-table-column>
        <el-table-column prop="orderTime" label="下单日期" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.orderTime | filterDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="consignee" label="姓名" width="120"></el-table-column>
        <el-table-column prop="deliverAddress" label="地址" width="200"></el-table-column>
        <el-table-column prop="deliveryTime" label="送货日期" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.deliveryTime | filterDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="金额" width="100"></el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="80"></el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="clickDetail(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="clickEditShow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 修改模态框 -->
    <el-dialog 
    title="订单修改" 
    top="5vh"
    :visible.sync="dialogEditVisible">
      <el-form :model="new_editdata" size="small">
        <el-form-item label="订单号">
          <el-input v-model="new_editdata.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="new_editdata.consignee"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="new_editdata.phone"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="new_editdata.orderState">
            <el-option value="已受理"></el-option>
            <el-option value="派送中"></el-option>
            <el-option value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input-number v-model="new_editdata.orderAmount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="下单时间">
          <div class="block">
            <el-date-picker
              v-model="new_editdata.orderTime"
              type="datetime"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="送达时间">
          <div class="block">
            <el-date-picker
              v-model="new_editdata.deliveryTime"
              type="datetime"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="new_editdata.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="clickEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { API_ORDERLIST, API_ORDERSEARCH, API_ORDEREDIT } from "@/api/apis.js";
export default {
  name: "order",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      orderData: [],
      total: null,

      currentPage: 1,
      pageSize: 10,
      orderNo: "",
      consignee: "",
      phone: "",
      orderState: "",
      date: "",

      dialogEditVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      old_editdata: {},
      new_editdata: {},
      formLabelWidth: "120px"
    };
  },
  filters: {
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
  methods: {
    //编辑弹框出现
    clickEditShow(item) {
      //修改前修改后数据比对
      this.old_editdata = JSON.parse(JSON.stringify(item));
      this.new_editdata = JSON.parse(JSON.stringify(item));
      this.dialogEditVisible = true;
    },

    //编辑确定
    clickEdit() {
      //比对修改前数据和修改后数据是否一致,先把时间戳转化为正常时期比对
      this.old_editdata.deliveryTime = this.filterDate(this.old_editdata.deliveryTime)
      this.old_editdata.orderTime = this.filterDate(this.old_editdata.orderTime)
      this.new_editdata.deliveryTime = this.filterDate(this.new_editdata.deliveryTime)
      this.new_editdata.orderTime = this.filterDate(this.new_editdata.orderTime)
      // console.log(1,this.old_editdata.deliveryTime,2,this.new_editdata.deliveryTime)
      for (let i in this.old_editdata) {
        if (this.old_editdata[i] != this.new_editdata[i]) {
          API_ORDEREDIT( this.new_editdata ).then(res => {
            if(res.data.code == 0) {
              this.$message.success("修改成功!")
              this.dialogEditVisible = false;
              this.getList()
            } else {
              this.$message.error("修改失败请稍后再试")
            }
          })
          return
        }
      }
      this.$message.error("未修改任何内容!")
    },

    //查看详情
    clickDetail(id) {
      this.$router.push(
        { path: "/index/orderDetail", query: { id } } //query传参会拼接在地址栏末尾
      );
    },

    //查询
    onSubmit() {
      // console.log(this.currentPage,this.pageSize,this.orderNo,this.consignee,this.phone,this.orderState,this.date)
      API_ORDERSEARCH({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.orderNo,
        consignee: this.consignee,
        phone: this.phone,
        orderState: this.orderState,
        date: this.date
      }).then(res => {
        if (res) {
          this.orderData = res.data.data;
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

    //获取订单列表
    getList() {
      API_ORDERLIST({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.orderNo,
        consignee: this.consignee,
        phone: this.phone,
        orderState: this.orderState,
        date: this.date
      }).then(res => {
        if (res) {
          this.orderData = res.data.data;
          this.total = res.data.total;
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
#order .el-dialog__body {
  padding-top: 0px;
}
</style>
<style lang="less" scoped>
#order {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #eee;
  box-sizing: border-box;
  .order-box {
    padding: 20px;
    background-color: #fff;
  }
}
</style>