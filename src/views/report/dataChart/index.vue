<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="report-public-header">
        <h3><slot></slot></h3>
        <el-select v-model="day" :placeholder="$t('public.select')" @change="dayChangeFun" style="width: 135px">
          <el-option v-for="item in options" :key="`${item.key}-${item.value}`" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
    <div class="dataChart report-public-content">
      <div class="dataChart-content">
        <ul class="dataChart-content-title">
          <li
            :class="['dataChart-content-title-list cursor', { 'active-list disabled-cursor': activeName === item.type }]"
            @click="tabClick(item.type)"
            v-for="item in typeList"
            :key="item.type"
          >
            {{ item.name }}
          </li>
        </ul>
        <chart :dataList="dataList" :id="activeName" />
      </div>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";

import { options } from "../day";
import chart from "./chart.vue";
export default {
  name: "DataChart",
  // 模板引入
  components: { chart },
  props: {
    typeList: {
      type: [],
      required: true,
    },
    dataList: {
      type: [],
      required: true,
    },
  },
  // 数据
  data() {
    return {
      activeName: "",
      options: options,
      day: 7,
    };
  },
  watch: {},
  // 方法
  methods: {
    dayChangeFun() {},
    tabClick(name) {
      this.activeName = name;
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {
    this.activeName = this.typeList[0].type;
  },
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
