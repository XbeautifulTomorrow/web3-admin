<template>
  <div class="dataChart report-public-content">
    <div class="report-public-header">
      <h2>{{ $t("report.dataChart") }}</h2>
      <el-select
        v-model="day"
        :placeholder="$t('public.select')"
        class="public-select-box"
        popper-class="public-select-box"
        @change="dayChangeFun"
      >
        <el-option
          v-for="item in options"
          :key="`${item.key}-${item.value}`"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="dataChart-content">
      <ul class="dataChart-content-title">
        <li
          :class="[
            'dataChart-content-title-list cursor',
            { 'active-list disabled-cursor': activeName === 'balance' },
          ]"
          @click="tabClick('balance')"
        >
          余额
        </li>
        <li
          :class="[
            'dataChart-content-title-list cursor',
            { 'active-list disabled-cursor': activeName === 'integral' },
          ]"
          @click="tabClick('integral')"
        >
          积分
        </li>
      </ul>
      <chart
        v-if="activeName === 'balance'"
        :mainChartDataShow="mainChartDataShowbalance"
        id="balance"
      />
      <chart
        v-if="activeName === 'integral'"
        :mainChartDataShow="mainChartDataShowintegral"
        id="integral"
      />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

import { options } from "../day";
import chart from "./chart.vue";
export default {
  name: "DataChart",
  // 模板引入
  components: { chart },
  // 数据
  data() {
    return {
      activeName: "balance",
      options: options,
      day: 7,
      mainChartDataShowbalance: [],
      mainChartDataShowintegral: [],
    };
  },
  // 方法
  methods: {
    dayChangeFun() {
      this.mainChartDataShowApi();
    },
    tabClick(name) {
      this.activeName = name;
    },
    async mainChartDataShowApi() {
      const { day } = this;
      const res = await this.$http.mainChartDataShow({ day });
      if (res) {
        const _data = Object.copyArrObj(res);
        let _databalanceArr = [];
        let _dataintegralArr = [];
        _data.forEach((item) => {
          const {
            addbalance = 0,
            connectbalance = 0,
            onlinebalance = 0,
            addintegral = 0,
            connectintegral = 0,
            onlineintegral = 0,
          } = item;
          const time = dayjs(item.time).format("YYYY-MM-DD HH:mm:ss");
          const _databalanceList = [
            {
              time,
              name: this.$t("report.addbalance"),
              value: addbalance,
            },
            {
              time,
              name: this.$t("report.connectbalance"),
              value: connectbalance,
            },
            {
              time,
              name: this.$t("report.onlinebalance"),
              value: onlinebalance,
            },
          ];
          const _dataintegralList = [
            {
              time,
              name: this.$t("report.addintegral"),
              value: addintegral,
            },
            {
              time,
              name: this.$t("report.connectintegral"),
              value: connectintegral,
            },
            {
              time,
              name: this.$t("report.onlineintegral"),
              value: onlineintegral,
            },
          ];
          _databalanceArr = [..._databalanceArr, ..._databalanceList];
          _dataintegralArr = [..._dataintegralArr, ..._dataintegralList];
        });
        this.mainChartDataShowbalance = _databalanceArr;
        this.mainChartDataShowintegral = _dataintegralArr;
      }
    },
  },
  // 创建后
  created() {
    this.mainChartDataShowApi();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.dataChart-content-title {
  display: flex;
  align-items: center;
  align-content: center;
  position: relative;
  top: 1px;
}
.dataChart-content-title-list {
  padding: 10px 20px;
  margin-right: 2px;
  background-color: #c6c6c6;
  color: #979797;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: #333333;
    background-color: #fff;
  }
}
.active-list {
  color: #333333;
  background-color: #fff;
}
</style>
<style lang="scss">
// .dataChart {
//   .el-tabs--border-integral > .el-tabs__header {
//     background-color: none;
//     border-bottom: none;
//   }
// }
</style>
