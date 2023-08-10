<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="title-box">
        <h3>用户地区统计</h3>
      </div>
    </div>
    <div class="report-table-box">
      <el-table :data="dataList" style="width: 100%" border>
        <el-table-column prop="qualityType" label="国家" align="center" key="1"> </el-table-column>
        <el-table-column prop="nftName" label="注册" align="center" key="2"> </el-table-column>
        <el-table-column prop="nftId" label="充值" align="center" key="3"> </el-table-column>
        <el-table-column prop="price" label="消费" align="center" key="4"> </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      dataList: [],
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
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.report-table-box {
  min-height: 300px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
