<template>
  <div class="reportChart" :id="id"></div>
</template>

<script>
import { Chart } from '@antv/g2';
export default {
  name: 'ReportChart',
  // 模板引入
  components: {},
  props: {
    mainChartDataShow: {
      tpe: Array,
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
    };
  },
  // 方法
  methods: {
    chartFun() {
      const { container, mainChartDataShow, id } = this;
      if (mainChartDataShow.length < 1 && !id) return;
      if (container) {
        this.container.clear();
      } else {
        this.container = new Chart({
          container: id,
          autoFit: true,
          height: 500,
        });
      }
      const chart = this.container;
      chart.data(mainChartDataShow);
      chart.scale({
        // 之前的chart.source()方法已经替换为chart.data()和chart.scale()
        time: {
          range: [0, 1], // 输出数据的范围，默认[ 0, 1 ]，格式为 [ min, max ]，min 和 max 均为 0 至 1 范围的数据 --官方
        }, // 简单来说就是 这个图标的多少用于显示数据[0,1]就是数据占满横坐标宽度,[0,0.5]就是还余下半个空的横坐标
        value: {
          min: 0, // 我的纵坐标count的最小值，不设置的话自动取数据中最小数的作为y=0的起始
          nice: true, // 默认为 true，用于优化数值范围，使绘制的坐标轴刻度线均匀分布。例如原始数据的范围为 [3, 97]，如果 nice 为 true，那么就会将数值范围调整为 [0, 100] --官方
        },
      });
      chart.tooltip({
        showCrosshairs: false,
        shared: true,
      });
      chart.legend({
        position: 'top-left',
      });
      chart.axis('time', {
        label: {
          offset: 25,
          rotate: -45,
          autoRotate: true,
          formatter(text) {
            // 字符太长添加省略号
            return text.length > 6 ? `${text.slice(0, 6)}...` : text;
          },
        },
      });
      chart
        .line()
        .position('time*value')
        .color('name');
      chart.render();
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {
    this.chartFun();
  },
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
  watch: {
    mainChartDataShow: {
      deep: true,
      handler: function(newData) {
        if (newData.length > 0) {
          this.chartFun();
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
