<template>
  <el-card class="register-chart">
    <div slot="header" class="clearfix">
      <div class="report-public-header">
        <h3>注册用户</h3>
        <el-select
          v-model="day"
          :placeholder="$t('public.select')"
          style="width: 135px"
          popper-class="public-select-box"
          @change="dayChangeFun"
        >
          <el-option v-for="item in options" :key="`${item.key}-${item.value}`" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
    <div class="report-public-content">
      <div id="container-funnel"></div>
    </div>
  </el-card>
</template>

<script>
import { Funnel } from "@antv/g2plot";

import { options } from "../day";

export default {
  name: "RegisterChart",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      options: options,
      day: 7,
      dataList: [
        { stage: "注册人数", number: 5123 },
        { stage: "充值人数", number: 3234 },
        { stage: "消费人数", number: 1123 },
      ],
    };
  },
  // 方法
  methods: {
    dayChangeFun() {},
    chartFun() {
      const data = this.dataList;
      const plot = new Funnel("container-funnel", {
        data: data,
        xField: "stage",
        yField: "number",
        legend: false,
      });

      plot.render();
    },
    clearTimerFun() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    async mainChartDataRegTotalApi() {},
  },
  // 创建后
  created() {
    this.mainChartDataRegTotalApi();
  },
  // 挂载后
  mounted() {
    this.chartFun();
  },
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {
    this.clearTimerFun();
  },
};
</script>

<style lang="scss" scoped>
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
    content: "";
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
