<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="title-box">
        <h3>竞赛排行榜</h3>
        <el-select v-model="type" @change="getDataList" style="width: 135px">
          <el-option :label="item.label" :value="item.value" v-for="item in selectOptions"></el-option>
        </el-select>
      </div>
    </div>
    <div class="report-table-box">
      <el-table :data="dataList" style="width: 100%" border>
        <el-table-column prop="qualityType" label="排名" align="center" key="1"> </el-table-column>
        <el-table-column prop="nftName" label="系列名" align="center" key="2"> </el-table-column>
        <el-table-column prop="nftId" label="地板价" align="center" key="3"> </el-table-column>
        <el-table-column prop="price" :label="labelTxt" align="center" key="4"> </el-table-column>
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
      type: "1",
      selectOptions: [
        { label: "售出票数", value: "1" },
        { label: "创建数", value: "2" },
        { label: "完成数", value: "3" },
      ],
      dataList: [],
    };
  },
  computed: {
    labelTxt() {
      const res = this.selectOptions.filter((x) => x.value == this.type);

      return res[0].label;
    },
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
}
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
