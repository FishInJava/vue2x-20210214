<template>
  <div>
    <p>This is BarChart Page</p>
    <ul>
      <li>
        <router-link to="/">LinkBoard</router-link>
      </li>
    </ul>
    <!--请求数据按钮-->
    <button @click="getBarDate()">{{ ip }}</button>
    <!--币种选择框-->
    <select v-model="selectedCurrency">
      <option
        v-for="currency in currencies"
        v-bind:value="currency.value"
        v-bind:key="currency.key"
      >
        {{ currency.value }}
      </option>
    </select>
    <span>selectedCurrency: {{ selectedCurrency }}</span>
    <button @click="getCurrency()">刷新币种</button>
    <!--echar柱状图展示模块-->
    <div id="main" style="width: 1600px; height: 400px"></div>
  </div>
</template>

<script>
import { reactive } from "vue";
import * as echarts from "echarts";
import axios from "axios";
export default {
  data() {
    return {
      ip: "http://localhost:8080",
      chartDom: null,
      selectData: [],
      selectedCurrency: null,
      currencies: [],
      option: {
        title: {
          text: '',
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "11%",
          containLabel: true,
        },
        legend: {
          data: ["open", "close", "low", "high"],
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              color: "#5e6877", // x轴字体颜色
              interval: 0, // 0 强制显示所有标签,默认auto
              rotate: 270, // 刻度标签旋转的角度
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        dataZoom: [
          {
            type: "slider",
            show: true,
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: "open",
            type: "bar",
            data: [],
            // label: {
            //   show: true,
            //   position: "inside",
            //   rotate: 270,
            // },
          },
          {
            name: "close",
            type: "bar",
            data: [],
            // label: {
            //   show: true,
            //   position: "inside",
            //   rotate: 270,
            // },
          },
          {
            name: "low",
            type: "bar",
            data: [],
            // label: {
            //   show: true,
            //   position: "inside",
            //   rotate: 270,
            // },
          },
          {
            name: "high",
            type: "bar",
            data: [],
            // label: {
            //   show: true,
            //   position: "inside",
            //   rotate: 270,
            // },
          },
        ],
      },
    };
  },
  methods: {
    init: function () {
      var chartDom = document.getElementById("main");
      this.chartDom = echarts.init(chartDom);
    },
    getBarDate: function () {
      // 发送http请求
      let url = this.ip + "/commonController/getCandlestick";
      axios
        .post(url, {
          size: 200,
          symbol: this.selectedCurrency,
          interval: "MON1",
        })
        .then((response) => {
          var dataArr = response.data.data;
          // 清空数组,不清空的话刻度值比例不正常
          this.option.xAxis[0].data = [];
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          this.option.series[2].data = [];
          this.option.series[3].data = [];
          // 组装数据
          dataArr.forEach((item, index) => {
            // 设置x轴
            var time = new Date(item.id * 1000).toLocaleDateString();
            this.option.xAxis[0].data.push(time);
            // 设置y轴 series:open,close,low,high
            this.option.series[0].data.push(item.open);
            this.option.series[1].data.push(item.close);
            this.option.series[2].data.push(item.low);
            this.option.series[3].data.push(item.high);
          });
          //
          this.option.title.text = '当前币种:' + this.selectedCurrency;
          // 绑定
          this.chartDom.setOption(this.option);
        });
    },
    // 获取币种
    getCurrency: function () {
      // 发送http请求
      let url = this.ip + "/commonController/getAllCurrency";
      axios.post(url, {}).then((response) => {
        var dataArr = response.data.data;
        // 组装数据
        this.currencies = dataArr;
      });
    },
  },
  mounted() {
    this.init();
    // 获取币种
    this.getCurrency();
  },
};
</script>
