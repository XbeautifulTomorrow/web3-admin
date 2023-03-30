<template>
  <div class="report">
  </div>
</template>

<script>
export default {
  name: 'Report',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {};
  },
  // 方法
  methods: {},
  // 创建后
  created() { },
  // 挂载后
  mounted() { },
  // 更新后
  updated() { },
  // 销毁
  beforeDestroy() { },
};
</script>

<style lang="scss" scoped>
.report-par {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.report-public-content {
  margin-bottom: 10px;
  background-color: #f2f2f2;
  padding: 10px 20px;

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
}</style>
