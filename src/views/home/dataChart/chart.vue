<template>
  <div :id="id"></div>
</template>

<script>
import { Line } from "@antv/g2plot";
export default {
  name: "ReportChart",
  // 模板引入
  components: {},
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    id: {
      type: String,
      required: true,
    },
  },
  // 数据
  data() {
    return {
      container: null,
      linePlot: null,
    };
  },
  // 方法
  methods: {
    chartFun() {
      const { container, dataList, id } = this;
      if (dataList.length < 1 && !id) return;
      const data = dataList;
      if (container) {
        this.container.clear();
      } else {
        if (this.linePlot) {
          this.linePlot.destroy();
        }
        // 创建折线图实例
        this.linePlot = new Line(id, {
          data,
          xField: "time", // x轴字段
          yField: "value", // y轴字段
          seriesField: "type", // 数据系列字段
          legend: true, // 是否展示图例
          smooth: true, // 是否平滑连接点
        });

        // 渲染图表
        this.linePlot.render();
      }
    },
    // chartFun() {
    //   const { container, dataList, id } = this;
    //   if (dataList.length < 1 && !id) return;
    //   const data = dataList;
    //   if (container) {
    //     this.container.clear();
    //   } else {
    //     const mergedData = [];
    //     data.forEach((d) => {
    //       Object.keys(d).forEach((key) => {
    //         if (key !== "time") {
    //           mergedData.push({
    //             year: d.time,
    //             value: d[key],
    //             series: key,
    //             type: d[key].type || null,
    //           });
    //         }
    //       });
    //     });
    //     if (this.linePlot) {
    //       this.linePlot.destroy();
    //     }
    //     // 创建折线图实例
    //     this.linePlot = new Line(id, {
    //       data: mergedData,
    //       xField: "time", // x轴字段
    //       yField: "value", // y轴字段
    //       seriesField: "type", // 数据系列字段
    //       legend: true, // 是否展示图例
    //       smooth: true, // 是否平滑连接点
    //     });

    //     // 渲染图表
    //     this.linePlot.render();
    //   }
    // },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {
    this.$nextTick(() => {
      this.chartFun();
    });
  },
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
  watch: {
    dataList: {
      deep: true,
      handler: function (newData) {
        if (newData.length > 0) {
          this.$nextTick(() => {
            this.chartFun();
          });
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.reportChart {
  padding: 10px 10px 20px 20px;
  background-color: #fff;
  border: 1px solid #c6c6c6;
}
</style>
