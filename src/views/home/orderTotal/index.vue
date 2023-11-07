<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="title-box">
        <h3>订单统计</h3>
      </div>
    </div>
    <div id="container-bar"></div>
  </el-card>
</template>

<script>
import { Bar } from "@antv/g2plot";
export default {
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      dataList: [
        { year: "1951 年", value: 38 },
        { year: "1952 年", value: 52 },
        { year: "1956 年", value: 61 },
        { year: "1957 年", value: 145 },
        { year: "1958 年", value: 48 },
      ],
    };
  },
  // 方法
  methods: {
    async getDataList() {
      const res = await this.$http.mainChartDataShow({ type: this.type });
      if (res) {
      }
    },
  },
  // 创建后
  created() {
    // this.mainChartDataShowApi();
  },
  // 挂载后
  mounted() {
    const data = this.dataList;
    const bar = new Bar("container-bar", {
      data,
      xField: "value",
      yField: "year",
      seriesField: "year",
      legend: {
        position: "top-left",
      },
    });

    bar.render();
  },
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.report-table-box {
  height: 100%;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
