<template>
  <div class="farm-list public-css">
    <div class="public-list-inputs">
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
        v-model.number="id"
        clearable
      />
      <!-- 矿场ID -->
      <!-- <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.farmId')}`"
        v-model.number="farmId"
        clearable
      /> -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.userID')}`"
        v-model.number="userId"
        clearable
      />
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('wallet.walletName')}`"
        v-model="walletName"
        clearable
      />
      <el-select
        v-model="coinId"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('currency.currency')}`"
        clearable
      >
        <el-option
          v-for="item in coinOptions"
          :key="item.id"
          :label="item.coinName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <!-- disabled -->
      <el-select
        v-model="strikeOut"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('userList.state')}`"
        clearable
      >
        <el-option
          v-for="item in strikeOutOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="public-search"
        @click="userWalletPageListApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column prop="id" :label="$t('farmList.id')" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.id || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center" width="320">
        <span slot-scope="scope">{{ scope.row.walletName || '--' }}</span>
      </el-table-column>
      <!-- 所属用户ID -->
      <el-table-column
        prop="userId"
        :label="$t('farmList.owningUserID')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column
        prop="farmId"
        :label="$t('minerList.farmId')"
        align="center"
      >
        <span v-if="scope.row.farmId" slot-scope="scope">
          {{ scope.row.farmId }}
        </span>
        <span v-else>
          {{ $t('wallet.global') }}
        </span>
      </el-table-column>
      <!-- 币种 -->
      <el-table-column
        prop="coinName"
        :label="$t('currency.currency')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.coinName || '--' }}
        </span>
      </el-table-column>
      <!-- 地址 -->
      <el-table-column
        prop="walletAddress"
        :label="$t('wallet.walletAddress')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.walletAddress || '--' }}
        </span>
      </el-table-column>
      <!-- 关联启动器 -->
      <el-table-column
        prop="flightNumber"
        :label="$t('wallet.flightNumber')"
        align="center"
      >
        <span
          :class="[
            {
              'blueColor cursor': scope.row.flightNumber,
            },
          ]"
          slot-scope="scope"
          @click="
            scope.row.flightNumber ? showTableFun(scope.row, 'flight') : ''
          "
        >
          {{ scope.row.flightNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column
        prop="strikeOut"
        :label="$t('userList.state')"
        align="center"
      >
        <span
          slot-scope="scope"
          :class="[
            { greenColor: scope.row.strikeOut === 0 },
            { redColor: scope.row.strikeOut === 1 },
          ]"
        >
          {{
            scope.row.strikeOut ? $t('userList.REMOVE') : $t('userList.NORMAL')
          }}
        </span>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userWalletPageList && userWalletPageList.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userWalletPageList.total"
      class="public-pagination"
    >
    </el-pagination>
    <!-- <flightDetails
      v-if="flightDialog && flightData"
      :popupDialog="flightDialog"
      :detailsData="flightData"
      @closePopup="closePopup"
    /> -->
    <flightList
      v-if="showTable === 'flight' && showPopupDialog"
      :walletId="walletId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import pagination from '../../../mixins/pagination';
import flightList from '../userList/table/flightList.vue';
export default {
  name: 'WalletsList',
  // 模板引入
  components: { flightList },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      farmId: '',
      userId: '',
      coinId: '',
      walletName: '',
      strikeOut: '',
      size: 20,
      page: 1,
      tableData: [],
      coinOptions: [],
      userWalletPageList: null,
      strikeOutOptions: [
        {
          value: 0,
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 1,
          label: this.$t('userList.REMOVE'),
        },
      ],
      showTable: '',
      walletId: '',
      showPopupDialog: false,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.showTable = '';
      this.walletId = '';
      this.showPopupDialog = false;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.userWalletPageListApi();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.userWalletPageListApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userWalletPageListApi(false);
    },
    searchFun() {
      return {
        id: this.id,
        farmId: this.farmId,
        userId: this.userId,
        coinId: this.coinId,
        walletName: this.walletName,
        strikeOut: this.strikeOut,
      };
    },
    showTableFun(row, name) {
      if (row && name) {
        this.walletId = row.id;
        this.showTable = name;
        this.showPopupDialog = true;
      }
    },
    async userWalletPageListApi(isSearch = true) {
      const search = this.searchFun();
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          size,
          page: _page,
        },
        ...search,
      };
      const res = await this.$http.userWalletPageList(data);
      if (res) {
        this.userWalletPageList = res;
        this.tableData = res.records;
      }
    },
    async coinConfigFindListApi() {
      // coinName 币种名称
      // contractAddress 合约地址
      const res = await this.$http.coinConfigFindList();
      if (res) {
        this.coinOptions = res;
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userWalletPageListApi();
    this.coinConfigFindListApi();
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
.farm-list-totals-list {
  :first-child {
    margin-right: 5px;
  }
}
</style>
