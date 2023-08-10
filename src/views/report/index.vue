<template>
  <div class="report-box">
    <!-- <card></card>
    <dataChart
      class="mg"
      :typeList="[
        { type: 'balance', name: '余额' },
        { type: 'integral', name: '积分' },
      ]"
      :dataList="dataList2"
    >
      金流监测
    </dataChart>
    <dataChart
      class="mg"
      :typeList="[
        { type: 'population', name: '人数' },
        { type: 'withdrawal', name: '充提' },
      ]"
      :dataList="dataList"
    >
      数据图表
    </dataChart>
    <dataChart
      class="mg"
      :typeList="[
        { type: 'yesterday', name: '次留' },
        { type: 'week', name: '7日' },
        { type: 'twoWeek', name: '14日' },
        { type: 'month', name: '30日' },
      ]"
      :dataList="dataList"
    >
      留存数据
    </dataChart>
    <div class="mg flex">
      <registerChart class="register-chart"></registerChart>
      <orderTotal class="order-total"></orderTotal>
      <registerArea class="register-area"></registerArea>
    </div>
    <div class="table-total-box">
      <rankNft class="sub-table"></rankNft>
      <rankRace class="sub-table"></rankRace>
      <rankArea class="sub-table"></rankArea>
    </div> -->
  </div>
</template>

<script>
import dataChart from "./dataChart";
import registerChart from "./registerChart";
import rankNft from "./rankNft";
import rankRace from "./rankRace";
import rankArea from "./rankArea";
import orderTotal from "./orderTotal";
import registerArea from "./registerArea";
import card from "./card";
export default {
  name: "Report",
  // 模板引入
  components: {
    dataChart,
    registerChart,
    card,
    rankNft,
    rankRace,
    rankArea,
    orderTotal,
    registerArea,
  },
  // 数据
  data() {
    return {
      dataList: [
        { year: "2010", series1: 100, series2: 200, series3: 300 },
        { year: "2011", series1: 120, series2: 220, series3: 230 },
        { year: "2012", series1: 140, series2: 240, series3: 260 },
      ],
      dataList2: [
        {
          year: "2018",
          series1: { value: 100, type: "充值" },
          series2: { value: 200, type: "消费" },
          series3: { value: 150, type: "提款" },
        },
        {
          year: "2019",
          series1: { value: 120, type: "充值" },
          series2: { value: 100, type: "消费" },
          series3: { value: 180, type: "提款" },
        },
        {
          year: "2020",
          series1: { value: 200, type: "充值" },
          series2: { value: 240, type: "消费" },
          series3: { value: 130, type: "提款" },
        },
      ],
    };
  },
  // 方法
  methods: {},
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.report-box {
  margin: 20px;
}
.report-par {
  display: flex;
  justify-content: space-between;
}
.mg {
  margin: 20px 0;
}
.flex {
  display: flex;
  gap: 20px;
  align-items: stretch;
}
.register-chart {
  flex: 1.5;
}
.order-total {
  flex: 1;
}
.register-area {
  flex: 1;
}
</style>
<style lang="scss">
.report-public-content {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.public-leaderboard {
  width: 33%;
  min-width: 423px;
  height: 423px;
  color: #333;
  margin-bottom: 0;
}

.report-public-header {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  justify-items: center;
}

.leaderboard-table {
  background: none;
  margin-top: 10px;

  tr,
  th.el-table__cell {
    background: none;
    color: #333;
  }
}

.public-leaderboard-table-header {
  font-weight: 600;
}
.table-total-box {
  display: flex;
  gap: 20px;
  .sub-table {
    flex: 1;
  }
}
</style>
