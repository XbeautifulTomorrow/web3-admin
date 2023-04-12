<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 140px;" placeholder="输入订单号" v-model="orderNumber" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入盲盒名称" v-model="boxName" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入用户ID/昵称" v-model="obscureField" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入hash" v-model="hash" clearable />
      <div class="public-date-box">
        <span class="demonstration">
          消费区间
        </span>
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最低价"
          v-model.number="startPrice" clearable />
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最高价"
          v-model.number="endPrice" clearable />
      </div>
      <div class="public-date-box">
        <span class="demonstration">
          交易时间
        </span>
        <el-date-picker v-model="transactionTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <div class="public-date-box">
        <span class="demonstration">
          交易完成时间
        </span>
        <el-date-picker v-model="transactionCompleteTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchOrderManagerList()">
        查询
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">订单数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.orderNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">开盒子数量</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.openBoxNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">消费总数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.consumeTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">佣金总数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.lotteryPrices }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">开奖总数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.rebatesPrices }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="订单号" align="center" key="1">
      </el-table-column>
      <el-table-column prop="boxImg" width="120" label="盲盒" align="center" key="2">
        <template slot-scope="scope">
          <div style="width: 100px; height: 100px">
            <el-image style="height: 100%;" :src="scope.row.boxImg" :preview-src-list="[scope.row.boxImg]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="boxName" width="120" label="盲盒名称" align="center" key="3">
      </el-table-column>
      <el-table-column prop="buyNumber" width="120" label="个数" align="center" key="4">
      </el-table-column>
      <el-table-column prop="userName" width="120" label="用户" align="center" key="5">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || '--' }}</p>
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userName || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="buyPrice" width="120" :label="`消费(${coin})`" align="center" key="6">
      </el-table-column>
      <el-table-column prop="flashId" width="120" label="闪兑ID" align="center" key="7">
      </el-table-column>
      <el-table-column width="120" label="返奖" align="center" key="8">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="handleView(scope.row)">
            查看
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="realPrice" width="120" :label="`返奖价值(${coin})`" align="center" key="9">
      </el-table-column>
      <el-table-column prop="rebatesPrice" width="120" :label="`佣金(${coin})`" align="center" key="10">
      </el-table-column>
      <el-table-column prop="buySource" width="120" label="消费渠道" align="center" key="11">
      </el-table-column>
      <el-table-column prop="walletAddress" width="120" label="钱包地址" align="center" key="12">
      </el-table-column>
      <el-table-column prop="hash" width="120" label="Harsh" align="center" key="13">
      </el-table-column>
      <el-table-column prop="flowId" width="120" label="流水号" align="center" key="14">
      </el-table-column>
      <el-table-column prop="traTime" width="140" label="交易时间" align="center" key="15">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.traTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="140" label="交易完成时间" align="center" key="16">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
    <el-dialog title="返奖详情" :visible.sync="showDialog" width="1200px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-table :data="revenueData" style="width: auto" height="400px" border>
        <el-table-column prop="orderNumber" label="订单号" align="center" key="1">
        </el-table-column>
        <el-table-column prop="boxName" label="盲盒名称" align="center" key="2">
        </el-table-column>
        <el-table-column prop="nftImg" label="奖品图片" align="center" width="120" key="3">
          <template slot-scope="scope">
            <div style="width: 100px; height: 100px">
              <el-image style="height: 100%;" :src="scope.row.nftImg" :preview-src-list="[scope.row.nftImg]">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="奖品系列" align="center" key="4">
        </el-table-column>
        <el-table-column prop="id" label="ID" align="center" key="4">
        </el-table-column>
        <el-table-column prop="price" :label="`奖品价值(${coin})`" align="center" key="4">
        </el-table-column>
        <el-table-column prop="userSelect" label="用户选择" align="center" key="4">
          <template slot-scope="scope">
            <span v-if="scope.row.userSelect == 'RECLAIM'">回收</span>
            <span v-if="scope.row.userSelect == 'HOLD'">持有</span>
          </template>
        </el-table-column>
        <el-table-column prop="realPrice" :label="`实际价值(${coin})`" align="center" key="4">
        </el-table-column>
        <el-table-column prop="lotteryStatus" label="NFT交付情况" align="center" key="4">
          <template slot-scope="scope">
            <span style="color: #D2D2D2;" v-if="scope.row.lotteryStatus == 'RECLAIMED'">已回收</span>
            <span style="color: #FF0707;" v-if="scope.row.lotteryStatus == 'FAIL'">交付失败</span>
            <span style="color: #09912E;" v-if="scope.row.lotteryStatus == 'SUCCESS'">已交付</span>
          </template>
        </el-table-column>
        <el-table-column prop="traTime" width="140" label="交易时间" align="center" key="4">
          <template slot-scope="scope">
            {{ timeForStr(scope.row.traTime, 'YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import { timeForStr } from '@/utils';
import pagination from '@/mixins/pagination';
export default {
  name: 'OrderManagement',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      orderNumber: null,
      boxName: null,
      obscureField: null,
      hash: null,
      startPrice: null,
      endPrice: null,
      transactionTime: null, // 交易时间
      transactionCompleteTime: null, // 交易完成时间
      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      aggregateQuery: null,

      showDialog: false,
      revenueData: null
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 搜索条件
    searchFun() {
      let { transactionTime, transactionCompleteTime } = this;
      let startTime = '';
      let endTime = '';
      let finishStartTime = '';
      let finishEndTime = '';
      if (transactionTime && transactionTime[0]) {
        startTime = timeForStr(transactionTime[0], 'YYYY-MM-DD');
      }
      if (transactionTime && transactionTime[1]) {
        endTime = timeForStr(transactionTime[1], 'YYYY-MM-DD');
      }
      if (transactionCompleteTime && transactionCompleteTime[0]) {
        finishStartTime = timeForStr(transactionCompleteTime[0], 'YYYY-MM-DD');
      }
      if (transactionCompleteTime && transactionCompleteTime[1]) {
        finishEndTime = timeForStr(transactionCompleteTime[1], 'YYYY-MM-DD');
      }

      return {
        orderNumber: this.orderNumber,
        boxName: this.boxName,
        obscureField: this.obscureField,
        hash: this.hash,
        startPrice: this.startPrice,
        endPrice: this.endPrice,
        startTime,
        endTime,
        finishStartTime,
        finishEndTime
      };
    },
    // 加载列表
    async fetchOrderManagerList(isSearch = true) {
      const search = this.searchFun();
      const { size, coin, userType } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          userType: userType,
          coin: coin,
          size: size,
          page: _page,
        },
        ...search,
      };
      const res = await this.$http.getOrderManagerList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getOrderManagerStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    async handleView(event) {
      const res = await this.$http.getBoxLotteryList({
        orderId: event.id,
        page: 1,
        size: 9999
      });
      if (res) {
        this.revenueData = res.records;
        this.showDialog = true;
      }
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDialog = false;
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchOrderManagerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchOrderManagerList(false);
    },
  },
  // 创建后
  created() {
    this.fetchOrderManagerList();
  },
  computed: {
    coin() {
      return this.$store.getters.coinConfig;
    },
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
