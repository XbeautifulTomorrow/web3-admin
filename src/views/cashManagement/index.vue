<template>
  <div class="user-list-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 140px;" placeholder="输入流水号" v-model="Id" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入用户ID" v-model="userId" clearable />
      <el-select v-model="flowType" class="public-select-box" popper-class="public-select-box" placeholder="全部金流状态"
        clearable>
        <el-option label="奖励" value="REWARD">
        </el-option>
        <el-option label="扣款" value="DEDUCTIONS">
        </el-option>
        <el-option label="收入" value="REVENUE">
        </el-option>
        <el-option label="消费" value="CONSUME">
        </el-option>
        <el-option label="充值" value="RECHARGE">
        </el-option>
        <el-option label="提现" value="WITHDRAWALS">
        </el-option>
      </el-select>
      <el-select v-model="coin" class="public-select-box" popper-class="public-select-box" placeholder="全部币种" clearable>
        <el-option label="USDT" value="USDT">
        </el-option>
        <el-option label="ETH" value="ETH">
        </el-option>
      </el-select>
      <el-select v-model="flowSource" class="public-select-box" popper-class="public-select-box" placeholder="全部来源"
        clearable>
        <el-option label="平台" value="PLATFORM">
        </el-option>
        <el-option label="钱包" value="WALLET">
        </el-option>
        <el-option label="返佣" value="REBATES">
        </el-option>
        <el-option label="余额" value="BALANCE">
        </el-option>
        <el-option label="回收" value="RECLAIM">
        </el-option>
      </el-select>
      <div class="public-date-box">
        <span class="demonstration">
          账变时间
        </span>
        <el-date-picker v-model="changeTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchAssetFlowList()">
        查询
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">总流水数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.flowNumberTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总Eth金额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.amountTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总Eth余额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.assetBalanceTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总U金额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.amountUTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总U余额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.assetBalanceUTotal }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="流水号" align="center" key="1">
      </el-table-column>
      <el-table-column prop="userId" width="120" label="用户ID" align="center" key="3">
      </el-table-column>
      <el-table-column prop="flowType" label="金流类型" align="center" key="4">
        <template slot-scope="scope">
          {{ formatType(scope.row.flowType) }}
        </template>
      </el-table-column>
      <el-table-column prop="flowSource" label="金流来源" align="center" key="5">
        <template slot-scope="scope">
          {{ formatSource(scope.row.flowSource) }}
        </template>
      </el-table-column>
      <el-table-column prop="flashId" label="闪兑Id" align="center" key="6">
      </el-table-column>
      <el-table-column prop="hash" label="Hash" align="center" key="7">
      </el-table-column>
      <el-table-column prop="walletAddress" label="钱包地址" align="center" key="8">
      </el-table-column>
      <el-table-column prop="coin" label="金流币种" align="center" key="9">
      </el-table-column>
      <el-table-column prop="traPrice" label="币种金额" align="center" key="10">
        <template slot-scope="scope">
          {{ scope.row.traPrice && Number(scope.row.traPrice || 0) > 0 ? `+${scope.row.traPrice}` : scope.row.traPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="changePrice" label="币种余额变化" align="center" key="11">
        <template slot-scope="scope">
          {{ scope.row.changePrice && Number(scope.row.changePrice || 0) > 0 ? `+${scope.row.changePrice}` :
            scope.row.changePrice }}
        </template>
      </el-table-column>
      <el-table-column prop="assetBalance" label="币种余额" align="center" key="12">
      </el-table-column>
      <el-table-column prop="createTime" label="账变时间" align="center" key="13">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import { timeForStr } from '@/utils';
import pagination from '@/mixins/pagination';
export default {
  name: 'CashManagement',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      Id: "", // NFT Id
      userId: "", // 系列名
      coin: "", // 币种
      flowType: "", // 流水状态
      flowSource: "", // 流水来源
      changeTime: "", // 账变时间
      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      aggregateQuery: null
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 搜索条件
    searchFun() {
      let { changeTime } = this;
      let startTime = '';
      let endTime = '';
      if (changeTime && changeTime[0]) {
        startTime = timeForStr(changeTime[0], 'YYYY-MM-DD');
      }
      if (changeTime && changeTime[1]) {
        endTime = timeForStr(changeTime[1], 'YYYY-MM-DD');
      }

      return {
        Id: this.Id, // 流水号
        userId: this.userId, // 用户Id
        coin: this.coin, // 币种
        flowType: this.flowType, // 流水状态
        flowSource: this.flowSource, // 流水来源
        startTime,
        endTime
      };
    },
    // 加载列表
    async fetchAssetFlowList(isSearch = true) {
      const search = this.searchFun();
      const { size, userType } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          userType: userType,
          size: size,
          page: _page,
        },
        ...search,
      };
      const res = await this.$http.getAssetFlowList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getAssetFlowStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    // 格式化流水类型
    formatType(event) {
      if (!event) return "";
      if (event == "REWARD") {
        return "奖励"
      } else if (event == "DEDUCTIONS") {
        return "扣款"
      } else if (event == "REVENUE") {
        return "收入"
      } else if (event == "CONSUME") {
        return "消费"
      } else if (event == "RECHARGE") {
        return "充值"
      } else if (event == "WITHDRAWALS") {
        return "提现"
      }
    },
    // 格式化流水来源
    formatSource(event) {
      if (!event) return "";
      if (event == "PLATFORM") {
        return "平台"
      } else if (event == "WALLET") {
        return "钱包"
      } else if (event == "REBATES") {
        return "返佣"
      } else if (event == "BALANCE") {
        return "余额"
      } else if (event == "RECLAIM") {
        return "回收"
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchAssetFlowList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchAssetFlowList(false);
    },
  },
  // 创建后
  created() {
    this.fetchAssetFlowList();
  },
  computed: {
    userType() {
      return this.$store.getters.accountConfig;
    },
  },
  // 挂载后
  mounted() { },
  // 更新后
  updated() { },
  // 销毁
  beforeDestroy() { },
};
</script>

<style lang="scss" scoped>
.remittance-box {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.remittance-amount {
  padding: 20px 0;
  border: 1px solid #666;
  text-align: center;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 50px;
  margin-bottom: 10px;

  .val {
    padding: 10px;
    padding-bottom: 0;
  }

  &>div {
    min-width: 200px;
  }
}

.remittance-more {
  display: flex;
}
</style>
