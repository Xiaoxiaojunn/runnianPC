<template>
  <div id="home">
    <div class="cards">
      <el-card v-for="(i,home) in list" :key="home" class="box-card">
        <div class="text item">
          <img :src="i.src" />
          <div class="font-box">
            <p>{{ i.title }}</p>
            <span>{{ i.num }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div
      id="home-echarts"
      style="width:calc(100%-30px);height:470px;padding:15px;background-color:#fff;"
    ></div>
  </div>
</template>

<script>
import { API_TOTALDATA } from "@/api/apis";
import echarts from "echarts";
export default {
  name: "home",
  data() {
    return {
      list: [
        {
          src: require("../../assets/img/index01.png"),
          title: "总订单",
          num: null
        },
        {
          src: require("../../assets/img/index02.png"),
          title: "总销售额",
          num: null
        },
        {
          src: require("../../assets/img/index03.png"),
          title: "今日订单数",
          num: null
        },
        {
          src: require("../../assets/img/index04.png"),
          title: "今日销售额",
          num: null
        }
      ]
    };
  },
  mounted() {
    //1.echarts DOM容器初始化
    var home_echarts = echarts.init(document.getElementById("home-echarts"));
    API_TOTALDATA().then(res => {
      let {
        amountData,
        orderData,
        todayOrder,
        totalAmount,
        totalOrder,
        totayAmount,
        xData
      } = res.data;
      this.list[0].num = totalOrder;
      this.list[1].num = totalAmount;
      this.list[2].num = todayOrder;
      this.list[3].num = totayAmount;
      //2.配置echarts option对象
      let option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单统计", "金额统计"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单统计",
            type: "line",
            stack: "总量",
            data: amountData
          },
          {
            name: "金额统计",
            type: "line",
            stack: "总量",
            data: orderData
          }
        ]
      };
      home_echarts.setOption(option);
    });
  }
};
</script>

<style>
#home .el-card__body {
  padding: 0 30px 0px 10px;
}
</style>
<style lang="less" scoped>
#home {
  background-color: #eee;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  .cards {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    .box-card {
      width: 300px;
      box-sizing: border-box;
      .text {
        font-size: 14px;
      }
      .item {
        padding: 18px 0;
        display: flex;
        justify-content: space-between;
        img:nth-child(1) {
          width: 80px;
        }
        img:nth-child(2) {
          width: 60px;
        }
        .font-box {
          text-align: center;
          p {
            font-size: 18px;
            color: #999;
            line-height: 32px;
            margin-top: 10px;
          }
          span {
            font-size: 14px;
            color: #333;
            line-height: 14px;
          }
        }
      }
    }
  }
}
</style>