<template>
  <div class="register-chart report-public-content">
    <div class="report-public-header">
      <h2>{{ $t('report.registerUser') }}</h2>
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
    <div class="register-chart-content" v-if="mainChartDataRegTotal">
      <div class="register-chart-number">
        <div class="number-list register-list">
          <numberText
            :title="$t('report.regNumber')"
            :number="mainChartDataRegTotal.regNumber"
          />
        </div>
        <div class="number-list add-list">
          <numberText
            :title="$t('report.addMinerNumber')"
            :number="mainChartDataRegTotal.addMinerNumber"
          />
          <numberText
            :title="$t('report.totalMinerNumber')"
            :number="mainChartDataRegTotal.totalMinerNumber"
          />
        </div>
        <div class="number-list card-list">
          <numberText
            :title="$t('report.mpNumber')"
            :number="mainChartDataRegTotal.mpNumber"
          />
          <numberText
            :title="$t('report.mpMinerNumber')"
            :number="mainChartDataRegTotal.mpMinerNumber"
          />
          <numberText
            :title="$t('report.mpCardNumber')"
            :number="mainChartDataRegTotal.mpCardNumber"
          />
        </div>
      </div>
      <div class="register-chart-container" id="registerChart"></div>
      <div class="register-chart-percent">
        <p class="percent-text percent-text-one">
          <span>{{ $t('report.registerAdd') }}</span>
          <span>
            {{
              Object.percentage(
                mainChartDataRegTotal.addMinerNumber,
                mainChartDataRegTotal.regNumber,
                2
              )
            }}
          </span>
        </p>
        <p class="percent-text percent-text-two">
          <span>{{ $t('report.addMining') }}</span>
          <span>
            {{
              Object.percentage(
                mainChartDataRegTotal.mpNumber,
                mainChartDataRegTotal.addMinerNumber,
                2
              )
            }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';

import { options } from '../day';

import numberText from './numberText.vue';

export default {
  name: 'RegisterChart',
  // 模板引入
  components: { numberText },
  // 数据
  data() {
    return {
      options: options,
      day: 7,
      mainChartDataRegTotal: null,
      chartDataShow: [],
      timer: null,
    };
  },
  // 方法
  methods: {
    dayChangeFun() {
      this.mainChartDataRegTotalApi();
    },
    chartFun() {
      const { container, chartDataShow } = this;
      if (chartDataShow.length < 1) return;
      if (container) {
        this.container.clear();
      } else {
        this.container = new Chart({
          container: 'registerChart',
          autoFit: true,
          height: 242,
          padding: [0, 0, 0, 0],
        });
      }
      const chart = this.container;
      chart.data(chartDataShow);
      chart.axis(false);
      chart.legend(false);
      chart.tooltip(false);
      chart.facet('mirror', {
        transpose: true,
      });
      chart
        .coordinate('rect')
        .transpose()
        .scale(1, -1);
      chart
        .interval()
        .adjust('symmetric')
        .position('action*pv')
        .shape('funnel')
        .color('action', [
          'rgba(109, 156, 252, 1)',
          'rgba(109,227,180, 1)',
          'rgba(123,143,179,1)',
        ]);
      chart.interaction('element-active');
      chart.on('beforepaint', () => {
        chart.annotation().clear(true);
        const chartData = chart.getData();
        // 中间标签文本
        chartData.forEach((obj, index) => {
          let position = ['50%', `${20 + index * 30 + (index - 1) * 5}%`];
          chart.annotation().text({
            top: true,
            position,
            content: obj.action, // 显示的文本内容
            style: {
              stroke: null,
              fill: '#fff',
              textAlign: 'center',
            },
          });
        });
      });
      chart.render();
    },
    clearTimerFun() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    async mainChartDataRegTotalApi() {
      this.clearTimerFun();
      const { day } = this;
      const res = await this.$http.mainChartDataRegTotal({ day });
      if (res) {
        this.mainChartDataRegTotal = res;
        this.chartDataShow = [
          {
            action: this.$t('report.register'),
            pv: 6,
            // pv: res.regNumber || 0,
          },
          {
            action: this.$t('report.addMiner'),
            pv: 5,
            // pv: res.addMinerNumber || 0,
          },
          {
            action: this.$t('report.mining'),
            pv: 4,
            // pv: res.mpNewNumber || 0,
          },
        ];
        this.timer = setTimeout(() => {
          this.chartFun();
        }, 100);
      }
    },
  },
  // 创建后
  created() {
    this.mainChartDataRegTotalApi();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {
    this.clearTimerFun();
  },
};
</script>

<style lang="scss" scoped>
.register-chart {
  height: 423px;
  min-width: calc(0.3% + 846px);
  width: 66.6%;
}
.register-chart-content {
  display: flex;
  position: relative;
  width: 100%;
  height: 350px;
}
.register-chart-number {
  min-width: 450px;
  width: calc(100% - 220px - 22.5%);
  position: absolute;
  top: 0;
  left: 0;
}
.number-list {
  height: 80px;
  font-size: 14px;
  padding: 20px;
  color: #333;
  margin-bottom: 1px;
  line-height: 20px;
  display: flex;
  :last-child {
    margin-bottom: 0;
  }
}
.register-list {
  background-color: rgba(109, 156, 252, 0.3);
}
.add-list {
  background-color: rgba(109, 227, 180, 0.3);
}
.card-list {
  background-color: rgba(123, 143, 179, 0.3);
}
.register-chart-container {
  position: absolute;
  top: 0;
  right: calc(200px + 20px);
  min-width: 300px;
  width: 45%;
}

.register-chart-percent {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  font-weight: 600;
  width: 200px;
  color: #333;
}
.percent-text {
  position: absolute;
  // left: 10px;
  max-width: 100%;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    height: 1px;
    width: 20px;
    background-color: #333333;
    margin-right: 5px;
  }
}
.percent-text-one {
  top: 72px;
  left: -5px;
}
.percent-text-two {
  top: 153px;
  left: -30px;
}
</style>
