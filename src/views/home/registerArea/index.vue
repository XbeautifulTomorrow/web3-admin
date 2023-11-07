<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="title-box">
        <h3>注册地区</h3>
        <el-select v-model="day" :placeholder="$t('public.select')" @change="dayChangeFun" style="width: 135px">
          <el-option v-for="item in options" :key="`${item.key}-${item.value}`" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
    <div class="report-table-box">
      <div id="container-pie"></div>
    </div>
  </el-card>
</template>

<script>
import { Pie } from "@antv/g2plot";
import { options } from "../day";
export default {
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      dataList: [
        { type: "中国", value: 27 },
        { type: "美国", value: 25 },
        { type: "新加坡", value: 18 },
        { type: "日本", value: 15 },
        { type: "印度", value: 10 },
        { type: "其他", value: 5 },
      ],
      options: options,
      day: 7,
    };
  },
  // 方法
  methods: {
    dayChangeFun() {
      // this.mainChartDataRegTotalApi();
    },
    async getDataList() {
      const res = await this.$http.mainChartDataShow({ type: this.type });
      if (res) {
      }
    },
    chartFunc() {
      const data = this.dataList;
      const piePlot = new Pie("container-pie", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        interactions: [{ type: "element-selected" }, { type: "element-active" }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: "pre-wrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            content: "注册地区",
          },
        },
      });

      piePlot.render();
    },
  },
  // 创建后
  created() {
    // this.mainChartDataShowApi();
  },
  // 挂载后
  mounted() {
    this.chartFunc();
  },
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.report-table-box {
  min-height: 300px;
}
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
