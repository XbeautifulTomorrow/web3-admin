<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入订单号" v-model="orderNum" clearable />
      <el-input class="public-input" style="width: 220px;" placeholder="输入 用户ID/昵称" v-model="userName" clearable />
      <el-input class="public-input" style="width: 220px;" placeholder="输入hash" v-model="txid" clearable />
      <el-input class="public-input" style="width: 220px;" placeholder="输入票号" v-model="num" clearable />
      <div class="public-date-box">
        <span class="demonstration">
          价格区间
        </span>
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最低价"
          v-model.number="startPrice" clearable />
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最高价"
          v-model.number="endPrice" clearable />
      </div>
      <div class="public-date-box">
        <span class="demonstration">
          票号区间
        </span>
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最低价"
          v-model.number="startNumbers" clearable />
        <el-input type="number" style="width: 120px;border: 1px solid #DCDFE6;border-radius: 4px;" placeholder="最高价"
          v-model.number="endNumbers" clearable />
      </div>
      <div class="public-date-box">
        <span class="demonstration">
          交易时间
        </span>
        <el-date-picker v-model="transactionTime" type="datetimerange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <div class="public-date-box">
        <span class="demonstration">
          交易完成时间
        </span>
        <el-date-picker v-model="transactionCompletionTime" type="datetimerange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search"
        @click="fetchOneNftLotteryOrdersManagerList()">
        查询
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">订单数量</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.numberOfOrders }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">开盒次数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.numberOfUnpacks }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总消费</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.totalConsumption }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总返奖</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.totalRebates }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总佣金</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.totalCommission }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="订单号" align="center" key="1">
      </el-table-column>
      <el-table-column prop="nftImage" label="NFT图" align="center" key="3">
        <template slot-scope="scope">
          <div style="width: 100px; height: 100px">
            <el-image style="height: 100%;" :src="scope.row.nftImage" :preview-src-list="[scope.row.nftImg]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="商品" align="center" key="4">
        <template slot-scope="scope">
          {{ `${scope.row.name} ${scope.row.orderId}` }}
        </template>
      </el-table-column>
      <el-table-column prop="tickets" label="票数" align="center" key="5">
      </el-table-column>
      <el-table-column label="票号" align="center" key="6">
        <template slot-scope="scope">
          {{ `${scope.row.startNumbers} ${scope.row.endNumbers}` }}
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="挂单用户" align="center" key="7">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userIsTest ? 'red' : '#000' }">{{ scope.row.userId || '--' }}</p>
          <p :style="{ color: scope.row.userIsTest ? 'red' : '#000' }">{{ scope.row.userName || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="expenditure" label="消费" align="center" key="8">
      </el-table-column>
      <el-table-column prop="winningStatus" label="返奖" align="center" key="9">
        <template slot-scope="scope">
          <span v-if="scope.row.winningStatus == 'YES'">查看返奖</span>
          <span v-else>未中奖</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentChannel" label="消费渠道" align="center" key="10">
      </el-table-column>
      <el-table-column prop="walletAddress" label="钱包地址" align="center" key="11">
      </el-table-column>
      <el-table-column prop="txid" label="Hash" align="center" key="13">
      </el-table-column>
      <el-table-column prop="expenditureSerialId" label="消费流水号" align="center" key="14">
      </el-table-column>
      <el-table-column prop="refundSerialId" label="退款流水号" align="center" key="15">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" key="17" fixed="right">
        <template slot-scope="scope">
          <span style="color: #05A8F0;" v-if="scope.row.status == 'TO_BE_AWARDED'">待开奖</span>
          <span style="color: #31CE0B;" v-if="scope.row.status == 'REFUNDED'">已退款</span>
          <span style="color: #BBBBBB;" v-if="scope.row.status == 'AWARDED'">已开奖</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTime" width="140px" label="付款时间" align="center" key="18" fixed="right">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.paymentTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="transactionTime" width="140px" label="交易完成时间" align="center" key="19" fixed="right">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.transactionTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="confirmationTime" width="140px" label="确认时间" align="center" key="20" fixed="right">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.confirmationTime, 'YYYY-MM-DD HH:mm:ss') }}
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
import { accurateDecimal, timeForStr } from '@/utils';
import pagination from '@/mixins/pagination';
export default {
  name: 'NftBuyRecord',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      orderNum: null,
      userName: null,
      txid: null,
      num: null,
      startPrice: null,
      endPrice: null,
      startNumbers: null,
      endNumbers: null,
      transactionTime: null,
      transactionCompletionTime: null,
      page: 1,
      size: 20,
      tableData: null,
      aggregateQuery: null,
      baseUserPage: null,
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    accurateDecimal: accurateDecimal,
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    searchFun() {
      let { transactionTime, transactionCompletionTime } = this;
      let startTxtime = null;
      let endTxTime = null;
      let startConfirmTime = null;
      let endConfirmTime = null;

      if (transactionTime && transactionTime[0]) {
        startTxtime = timeForStr(transactionTime[0], 'YYYY-MM-DD HH:mm:ss');
      }
      if (transactionTime && transactionTime[1]) {
        endTxTime = timeForStr(transactionTime[1], 'YYYY-MM-DD HH:mm:ss');
      }

      if (transactionCompletionTime && transactionCompletionTime[0]) {
        startConfirmTime = timeForStr(transactionCompletionTime[0], 'YYYY-MM-DD HH:mm:ss');
      }
      if (transactionCompletionTime && transactionCompletionTime[1]) {
        endConfirmTime = timeForStr(transactionCompletionTime[1], 'YYYY-MM-DD HH:mm:ss');
      }

      return {
        orderNum: this.orderNum,
        userName: this.userName,
        txid: this.txid,
        num: this.num,
        startPrice: this.startPrice,
        endPrice: this.endPrice,
        startNumbers: this.startNumbers,
        endNumbers: this.endNumbers,
        startTxtime,
        endTxTime,
        startConfirmTime,
        endConfirmTime
      };
    },
    // 加载列表
    async fetchOneNftLotteryOrdersManagerList(isSearch = true) {
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
      const res = await this.$http.getOneNftLotteryOrdersManagerList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getOneNftLotteryOrdersStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    // 上架和下架
    operatingNft(row) {
      this.$confirm(`确定要${row.upAndDown == 'down' ? '上架' : '下架'}一元购活动『${row.seriesName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = await this.$http.updateOneNftOrders({
            id: row.id,
            upAndDown: row.upAndDown == "down" ? "up" : "down"
          });
          if (res) {
            this.fetchOneNftLotteryOrdersManagerList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchOneNftLotteryOrdersManagerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchOneNftLotteryOrdersManagerList(false);
    },
  },
  // 创建后
  created() {
    this.fetchOneNftLotteryOrdersManagerList();
  },
  // 计算属性
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
