<template>
  <div class="box-card">
    <el-card v-for="o in 10" :key="o" class="card-item">
      <p class="title">{{ dataList[0].title }}</p>
      <p class="num">{{ dataList[0].num }}</p>
      <p class="increase">
        <span class="sub-title">昨日：</span>{{ dataList[0].increaseDayNum }}
      </p>
      <p class="increase">
        <span class="sub-title">同比上周：</span
        >{{ dataList[0].increaseDayNum }}
        <i class="el-icon-top"></i>
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      dataList: [
        {
          title: "注册人数",
          num: 320,
          increaseDayNum: 12,
          increaseWeekRate: 12,
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
.box-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .card-item {
    width: calc((100% - 80px) / 5);
  }
  .title {
    font-size: 18px;
    color: #333;
    font-weight: 500;
  }
  .num {
    color: #333;
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
  .increase {
    color: #67c23a;
    margin-top: 10px;
    font-weight: bold;
    font-size: 16px;
    i {
      font-weight: bold;
    }
    span {
      color: #666;
      font-size: 14px;
    }
  }
}
</style>
