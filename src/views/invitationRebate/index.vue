<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 140px;" placeholder="输入用户ID/昵称" v-model="obscureField" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入email" v-model="email" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入钱包地址" v-model="walletAddress" clearable />
      <div class="public-date-box">
        <span class="demonstration">
          最后领取时间
        </span>
        <el-date-picker v-model="lastPickUpTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchRebatesBaseList()">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="onExport()">
        导出
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">下级数量</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.downNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总佣金</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.rebatesAmountTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">未领取佣金</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.noReceiveAmounts }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">已领取佣金</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.receiveAmounts }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">领取数量</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.receiveNumber }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="userName" width="120" label="用户" align="center" key="1">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || '--' }}</p>
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userName || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="email" width="120" label="邮箱" align="center" key="2">
      </el-table-column>
      <el-table-column prop="walletAddress" width="120" label="钱包地址" align="center" key="3">
      </el-table-column>
      <el-table-column prop="downIdNumber" width="120" label="下级数量" align="center" key="4">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="showDown(scope.row)">
            {{ scope.row.downIdNumber || 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" width="120" label="总佣金" align="center" key="5">
      </el-table-column>
      <el-table-column prop="receiveAmount" width="120" label="已领取佣金" align="center" key="6">
      </el-table-column>
      <el-table-column prop="noReceiveAmount" width="120" label="未领取佣金" align="center" key="7">
      </el-table-column>
      <el-table-column prop="lastReceiveTime" width="140" label="最后领取时间" align="center" key="8">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.lastReceiveTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
    <el-dialog title="返奖详情" :visible.sync="showDownDialog" width="1200px" :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="public-list-inputs">
        <el-input class="public-input" style="width: 140px;" placeholder="输入用户ID/昵称" v-model="downObscureField"
          clearable />
        <el-input class="public-input" style="width: 140px;" placeholder="输入email" v-model="downEmail" clearable />
        <el-input class="public-input" style="width: 140px;" placeholder="输入钱包地址" v-model="downWalletAddress" clearable />
        <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchRebatesBaseDownList()">
          查询
        </el-button>

        <el-button type="primary" icon="el-icon-download" class="public-search" @click="onDownExport()">
          导出
        </el-button>
      </div>
      <div class="remittance-box">
        <div class="remittance-amount remittance-more">
          <div class="remittance-item">
            <div class="title">总下级数量</div>
            <div class="val">{{ downAggregateQuery && downAggregateQuery.downNumber }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总笔数</div>
            <div class="val">{{ downAggregateQuery && downAggregateQuery.traNumberTotal }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总消费</div>
            <div class="val">{{ downAggregateQuery && downAggregateQuery.consumeTotal }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总佣金</div>
            <div class="val">{{ downAggregateQuery && downAggregateQuery.rebatesAmountTotal }}</div>
          </div>
        </div>
      </div>
      <el-table :data="downData" style="width: auto" height="400px" border>
        <el-table-column prop="userName" width="120" label="用户" align="center" key="1">
          <template slot-scope="scope">
            <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || '--' }}</p>
            <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userName || '--' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="email" width="120" label="邮箱" align="center" key="2">
        </el-table-column>
        <el-table-column prop="walletAddress" width="120" label="钱包地址" align="center" key="3">
        </el-table-column>
        <el-table-column prop="traNumber" width="120" label="交易笔数" align="center" key="4">
        </el-table-column>
        <el-table-column prop="consumeTotal" width="120" label="消费金额" align="center" key="5">
        </el-table-column>
        <el-table-column prop="commissionRate" width="120" label="返佣比例" align="center" key="6">
          <template slot-scope="scope">
            {{ `${new bigNumber(scope.row.commissionRate).multipliedBy(100)}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" width="120" label="佣金" align="center" key="7">
        </el-table-column>
        <el-table-column prop="createTime" width="140" label="注册时间" align="center" key="8">
          <template slot-scope="scope">
            {{ timeForStr(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="downBaseUserPage && downBaseUserPage.total" background @size-change="handleDownSizeChange"
        @current-change="handleDownCurrentChange" :current-page="downPage" :page-sizes="pagination.pageSizes"
        :page-size="downSize" layout=" sizes, prev, pager, next, jumper" :total="downBaseUserPage.total"
        class="public-pagination">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import { timeForStr, exportExcel } from '@/utils';
import pagination from '@/mixins/pagination';
import config from "@/config/env";

export default {
  name: 'invitationRebate',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      obscureField: null,
      email: null,
      walletAddress: null,
      lastPickUpTime: null, // 交易时间
      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      aggregateQuery: null,

      /** 下级相关 */
      upId: null,
      showDownDialog: false,
      downObscureField: null,
      downEmail: null,
      downWalletAddress: null,
      downPage: 1,
      downSize: 20,
      downData: null,
      downBaseUserPage: null,
      downAggregateQuery: null,
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 搜索条件
    searchFun() {
      let { lastPickUpTime } = this;
      let startTime = null;
      let endTime = null;
      if (lastPickUpTime && lastPickUpTime[0]) {
        startTime = timeForStr(lastPickUpTime[0], 'YYYY-MM-DD');
      }
      if (lastPickUpTime && lastPickUpTime[1]) {
        endTime = timeForStr(lastPickUpTime[1], 'YYYY-MM-DD');
      }

      return {
        obscureField: this.obscureField,
        email: this.email,
        startPrice: this.startPrice,
        endPrice: this.endPrice,
        startTime,
        endTime
      };
    },
    // 加载列表
    async fetchRebatesBaseList(isSearch = true) {
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
      const res = await this.$http.getRebatesBaseList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
        this.tableData = [11, 144];
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getRebatesBaseStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    showDown(event) {
      this.upId = event.id;
      this.fetchRebatesBaseDownList();
      this.showDownDialog = true;
    },
    async fetchRebatesBaseDownList(isSearch = true) {
      const search = {
        obscureField: this.downObscureField,
        email: this.downEmail,
        walletAddress: this.downWalletAddress,
        upId: this.upId
      };

      const { downSize, coin, userType } = this;
      let _page = this.downPage;
      if (isSearch) {
        this.downPage = 1;
        _page = 1;
      }
      const data = {
        ...{
          userType: userType,
          coin: coin,
          size: downSize,
          page: _page,
        },
        ...search,
      };
      const res = await this.$http.getRebatesBaseDownList(data);
      if (res) {
        this.downBaseUserPage = res;
        this.downData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getRebatesBaseDownStatistics(data);
      if (resAggregateQuery) {
        this.downAggregateQuery = resAggregateQuery;
      }
    },
    // 列表导出
    onExport() {
      const search = this.searchFun();
      const urlStr = config.api + '/rebates-base/exportExcel';
      const { coin, userType } = this;
      const data = {
        ...{
          coin: coin,
          userType: userType
        },
        ...search,
      };

      exportExcel(urlStr, data, "邀请列表导出")
    },
    // 下级列表导出
    onDownExport() {
      const search = {
        obscureField: this.downObscureField,
        email: this.downEmail,
        walletAddress: this.downWalletAddress,
        upId: this.upId
      };
      const urlStr = config.api + '/rebates-base/down/exportExcel';
      const { coin, userType } = this;
      const data = {
        ...{
          coin: coin,
          userType: userType
        },
        ...search,
      };

      exportExcel(urlStr, data, "邀请下级列表导出")
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDownDialog = false;
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchRebatesBaseList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchRebatesBaseList(false);
    },
    handleDownSizeChange(val) {
      this.downSize = val;
      this.fetchRebatesBaseDownList();
    },
    handleDownCurrentChange(val) {
      this.downPage = val;
      this.fetchRebatesBaseDownList(false);
    },
  },
  // 创建后
  created() {
    this.fetchRebatesBaseList();
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
