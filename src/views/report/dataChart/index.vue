<template>
  <div class="dataChart report-public-content">
    <div class="report-public-header">
      <h2>{{ $t('report.dataChart') }}</h2>
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
            { 'active-list disabled-cursor': activeName === 'miner' },
          ]"
          @click="tabClick('miner')"
        >
          {{ $t('farmList.miner') }}
        </li>
        <li
          :class="[
            'dataChart-content-title-list cursor',
            { 'active-list disabled-cursor': activeName === 'card' },
          ]"
          @click="tabClick('card')"
        >
          {{ $t('userList.graphicsCard') }}
        </li>
        <li
          :class="[
            'dataChart-content-title-list cursor',
            { 'active-list disabled-cursor': activeName === 'user' },
          ]"
          @click="tabClick('user')"
        >
          {{ $t('report.user') }}
        </li>
      </ul>
      <chart
        v-if="activeName === 'miner'"
        :mainChartDataShow="mainChartDataShowMiner"
        id="miner"
      />
      <chart
        v-if="activeName === 'card'"
        :mainChartDataShow="mainChartDataShowCard"
        id="card"
      />
      <chart
        v-if="activeName === 'user'"
        :mainChartDataShow="mainChartDataShowUser"
        id="user"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { options } from '../day';
import chart from './chart.vue';
export default {
  name: 'DataChart',
  // 模板引入
  components: { chart },
  // 数据
  data() {
    return {
      activeName: 'miner',
      options: options,
      day: 7,
      mainChartDataShowMiner: [],
      mainChartDataShowCard: [],
      mainChartDataShowUser: [],
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
        let _dataMinerArr = [];
        let _dataCardArr = [];
        let _dataUserArr = [];
        _data.forEach((item) => {
          const {
            addMiner = 0,
            connectMiner = 0,
            onlineMiner = 0,
            addCard = 0,
            connectCard = 0,
            onlineCard = 0,
            regUser = 0,
            loginUser = 0,
          } = item;
          const time = dayjs(item.time).format('YYYY-MM-DD');
          const _dataMinerList = [
            {
              time,
              name: this.$t('report.addMiner'),
              value: addMiner,
            },
            {
              time,
              name: this.$t('report.connectMiner'),
              value: connectMiner,
            },
            {
              time,
              name: this.$t('report.onlineMiner'),
              value: onlineMiner,
            },
          ];
          const _dataCardList = [
            {
              time,
              name: this.$t('report.addCard'),
              value: addCard,
            },
            {
              time,
              name: this.$t('report.connectCard'),
              value: connectCard,
            },
            {
              time,
              name: this.$t('report.onlineCard'),
              value: onlineCard,
            },
          ];
          const _dataUserList = [
            {
              time,
              name: this.$t('report.regUser'),
              value: regUser,
            },
            {
              time,
              name: this.$t('report.loginUser'),
              value: loginUser,
            },
          ];
          _dataMinerArr = [..._dataMinerArr, ..._dataMinerList];
          _dataCardArr = [..._dataCardArr, ..._dataCardList];
          _dataUserArr = [..._dataUserArr, ..._dataUserList];
        });
        this.mainChartDataShowMiner = _dataMinerArr;
        this.mainChartDataShowCard = _dataCardArr;
        this.mainChartDataShowUser = _dataUserArr;
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
//   .el-tabs--border-card > .el-tabs__header {
//     background-color: none;
//     border-bottom: none;
//   }
// }
</style>
