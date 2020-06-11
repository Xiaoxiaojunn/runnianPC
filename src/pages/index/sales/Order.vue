<template>
  <div class="goods">
    <div>
      <el-date-picker
        v-model="date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button type="primary" @click="clickSearch">查询</el-button>
    </div>
    <div
      id="canvers-box"
      style="width:calc(100%-30px);height:470px;padding:15px;background-color:#fff;margin-top: 30px;"
    ></div>
  </div>
</template>

<script>
import { API_ORDERTOTAL } from "@/api/apis.js";
import echarts from "echarts";
export default {
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
      date: [this.filterDate(new Date()), this.filterDate(new Date())]
    };
  },
  methods: {
    clickSearch() {
      this.getList();
    },

    getList() {
      var carvers_box = echarts.init(document.getElementById("canvers-box"))
      var orderTime = [];
      var orderAmount = [];
      API_ORDERTOTAL({ date: JSON.stringify(this.date) }).then(res => {
        res.data.data.forEach(item => {
          orderTime.push(this.filterDate(item.orderTime));
          orderAmount.push(item.orderAmount);
          let option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                crossStyle: {
                  color: "#999"
                }
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            xAxis: [
              {
                type: "category",
                data: orderTime,
                axisPointer: {
                  type: "shadow"
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                name: "订单金额",
                min: 0,
                max: 150,
                interval: 30,
                axisLabel: {
                  formatter: "{value} 元"
                }
              }
            ],
            series: [
              {
                name: "订单金额",
                type: "line",
                data: orderAmount
              }
            ]
          };
          carvers_box.setOption(option);
        });
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
  mounted() {
    this.getList()
  }
};
</script>

<style lang="less" scoped>
</style>