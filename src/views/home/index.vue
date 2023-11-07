<template>
  <div class="report-box">
    <card></card>
    <dataChart class="mg" :typeList="goldFlowSearch" @change="changeTypeCash" :dataList="goldFlowDataList" defaultTime="TWENTYFOURHOUR">
      金流监测
    </dataChart>
    <dataChart class="mg" :typeList="dataDrawSearch" :dataList="dataDrawDataList" @change="changeTypeChart"> 数据图表 </dataChart>
    <dataChart class="mg" :typeList="retainedSearch" :dataList="retainedDataList" @change="changeTypeKeep"> 留存数据 </dataChart>
    <div class="mg flex">
      <registerChart class="register-chart"></registerChart>
      <orderTotal class="order-total"></orderTotal>
      <registerArea class="register-area"></registerArea>
    </div>
    <div class="table-total-box">
      <rankNft class="sub-table"></rankNft>
      <rankRace class="sub-table"></rankRace>
      <rankArea class="sub-table"></rankArea>
    </div>
  </div>
</template>

<script>
import dataChart from "./dataChart";
import registerChart from "./registerChart";
import rankNft from "./rankNft";
import rankRace from "./rankRace";
import rankArea from "./rankArea";
import orderTotal from "./orderTotal";
import registerArea from "./registerArea";
import card from "./card";
export default {
  name: "Report",
  // 模板引入
  components: {
    dataChart,
    registerChart,
    card,
    rankNft,
    rankRace,
    rankArea,
    orderTotal,
    registerArea,
  },
  // 数据
  data() {
    return {
      goldFlowSearch: [
        { type: "BALANCE", name: "余额" },
        { type: "POINT", name: "积分" },
      ],
      goldFlowDataList: [],
      dataDrawSearch: [
        { type: "PEOPLES", name: "人数" },
        { type: "RECHARGE", name: "充值" },
        { type: "CONSUME", name: "消费" },
        { type: "REVENUE", name: "收入" },
        { type: "WITHDRAWALS", name: "提款" },
      ],
      dataDrawDataList: [],
      retainedSearch: [
        { type: "CILIU", name: "次留" },
        { type: "SEVEN", name: "7日" },
        { type: "FOURTEEN", name: "14日" },
        { type: "THIRTY", name: "30日" },
      ],
      retainedDataList: [],
    };
  },
  // 方法
  methods: {
    //金流监测
    async changeTypeCash(data) {
      let assetType = this.goldFlowSearch[0].type;
      let timeLimit = "TWENTYFOURHOUR";
      if (data) {
        assetType = data.type;
        timeLimit = data.day;
      }
      const res = await this.$http.getHomeCashFlowDetection({ assetType, timeLimit });
      if (res) {
        const newArray = [];
        res.forEach((obj) => {
          for (let key in obj) {
            if (key !== "time") {
              const newObject = {
                type: key,
                value: obj[key],
                time: obj.time,
              };
              newArray.push(newObject);
            }
          }
        });
        this.goldFlowDataList = newArray;
      }
    },
    // 数据图表
    async changeTypeChart(data) {
      let type = this.dataDrawSearch[0].type;
      let timeLimit = "SEVEN";
      if (data) {
        type = data.type;
        timeLimit = data.day;
      }
      const res = await this.$http.getHomeDataChart({ type, timeLimit });
      if (res) {
        if (type == this.dataDrawSearch[0].type) {
          const newArray = [];
          res.forEach((obj) => {
            for (let key in obj) {
              if (key !== "time") {
                const newObject = {
                  type:
                    key === "recharge"
                      ? "充值"
                      : key === "consume"
                      ? "消费"
                      : key === "login"
                      ? "登录"
                      : key === "register"
                      ? "注册"
                      : key === "withdrawals"
                      ? "提款"
                      : "其他",
                  value: obj[key],
                  time: obj.time,
                };
                newArray.push(newObject);
              }
            }
          });
          this.dataDrawDataList = newArray;
        } else {
          this.dataDrawDataList = res.map((x) => {
            return { value: x.totalAmount, time: x.time };
          });
        }
      }
    },
    // 留存数据
    async changeTypeKeep(data) {
      let retainedDimension = this.retainedSearch[0].type;
      let timeLimit = "SEVEN";
      if (data) {
        retainedDimension = data.type;
        timeLimit = data.day;
      }
      const res = await this.$http.getHomeRetainedData({ retainedDimension, timeLimit });
      if (res) {
        const newArray = [];
        res.forEach((obj) => {
          for (let key in obj) {
            if (key !== "dayTime") {
              const newObject = {
                type: key === "" ? "留存比例" : key === "registerNum" ? "注册人数" : key === "loginNum" ? "登录人数" : "其他",
                value: obj[key],
                time: obj.dayTime,
              };
              newArray.push(newObject);
            }
          }
        });
        this.retainedDataList = newArray;
      }
    },
  },
  // 创建后
  created() {
    this.changeTypeCash();
    this.changeTypeChart();
    this.changeTypeKeep();
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
.report-box {
  margin: 20px;
}
.report-par {
  display: flex;
  justify-content: space-between;
}
.mg {
  margin: 20px 0;
}
.flex {
  display: flex;
  gap: 20px;
  align-items: stretch;
}
.register-chart {
  flex: 1.5;
}
.order-total {
  flex: 1;
}
.register-area {
  flex: 1;
}
</style>
<style lang="scss">
.report-public-content {
  margin-bottom: 10px;

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
}
.table-total-box {
  display: flex;
  gap: 20px;
  .sub-table {
    flex: 1;
  }
}
</style>
