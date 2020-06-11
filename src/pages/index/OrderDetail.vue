<template>
  <el-card class="box-card order-detail">
    <div class="clearfix header" slot="header">
      <label>订单号:</label>
      <span>{{ datalist.orderNo }}</span>
      <label>下单时间:</label>
      <span>{{ datalist.orderTime | filterDate }}</span>
      <el-button style="float:right" class="el-icon-arrow-left" type="text" @click="$router.go(-1)">返回订单管理</el-button>
    </div>
    <div class="container mb-2">
      <div class="left-box">
        <h2>{{ datalist.orderState }}</h2>
        <p class="mt-5">
          <span>备注</span>
          <span>{{ datalist.remarks }}</span>
        </p>
      </div>
      <div></div>
    </div>
    <div class="container-card">
      <div class="left-card card-con">
        <h5>付款信息</h5>
        <p>
          <span>订单金额:</span>
          <span>{{ datalist.orderAmount | filterMoney }}</span>
        </p>
        <p>
          <span>送达时间:</span>
          <span>{{ datalist.deliveryTime | filterDate }}</span>
        </p>
      </div>
      <div class="center-card card-con">
        <h5>卖家信息</h5>
        <p>
          <span>姓名:</span>
          <span>{{ datalist.consignee }}</span>
        </p>
        <p>
          <span>电话:</span>
          <span>{{ datalist.phone }}</span>
        </p>
        <p>
          <span>地址:</span>
          <span>{{ datalist.deliverAddress }}</span>
        </p>
      </div>
    </div>
  </el-card>
</template>

<script>
import { API_ORDERDETAIL } from "@/api/apis.js";
export default {
  data() {
    return {
      datalist: {}
    };
  },
  filters: {
    filterDate(date) {
      var time = new Date(date);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();

      function timeAdd0(str) {
        if (str < 10) {
          str = "0" + str;
        }
        return str;
      }
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
    },
    filterMoney(arr) {
      return arr + "元";
    }
  },
  methods: {
    getList(id) {
      API_ORDERDETAIL({ id }).then(res => {
        if (res) {
          this.datalist = res.data.data;
        }
      });
    }
  },
  created() {
    this.getList(this.$route.query.id);
  }
};
</script>

<style lang="less" scoped>
@font_color: #409eff; //蓝色
.order-detail {
  color: #666;
  .header {
    font-size: 14px;
    color: #333;
    label {
      margin-right: 10px;
    }
    span {
      margin-right: 30px;
    }
    .el-button {
      float: right;
      padding: 0;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .container {
    border: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    border-radius: 2px;
    .left-box {
      border-right: 1px solid #e5e5e5;
      width: 30%;
      box-sizing: border-box;
      padding: 15px;
      h2 {
        font-weight: 500;
        color: #333;
        font-size: 22px;
        letter-spacing: 1.5px;
        margin-top: 0px;
      }
      p {
        display: flex;
        font-size: 14px;
        margin-bottom: 0px;
        span {
          margin-right: 20px;
        }
      }
    }
  }
  .container-card {
    display: flex;
    padding: 15px;
    background-color: #f2f6fc;
    text-align: left;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    .card-con {
      width: 30%;
    }
    h5 {
      font-size: 14px;
      color: #606266;
      line-height: 30px;
      margin: 0;
      margin-bottom: 6px;
      font-weight: 600;
    }
    p {
      font-size: 12px;
      line-height: 22px;
      margin: 0;
      span {
        margin-right: 10px;
      }
    }
  }
}
.mb-2 {
  margin-bottom: 20px;
}
.mt-5 {
  margin-top: 50px;
}
</style>