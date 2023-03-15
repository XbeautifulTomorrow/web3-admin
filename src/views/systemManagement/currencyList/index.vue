<template>
  <div class="miner-list public-css">
    <div class="public-list-inputs pbulic-space-between">
      <div class="publick-search-list">
        <!-- 输入名称 -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('miningSoftware.coinName')}`"
          v-model="coinName"
          clearable
        />
        <!-- 输入合约地址 -->
        <el-input
          class="public-input"
          :placeholder="
            `${$t('public.write')}${$t('currency.contractAddress')}`
          "
          v-model="contractAddress"
          clearable
        />
      </div>
      <div class="public-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="public-search"
          @click="coinConfigPageListApi"
        >
          {{ $t('public.search') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopup(null)"
        >
          {{ $t('currency.addCurrency') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.coinName || '--' }}</span>
      </el-table-column>
      <!-- 图标 -->
      <el-table-column :label="$t('currency.coinImage')" align="center">
        <img
          class="coinImage"
          slot-scope="scope"
          :src="scope.row.coinImage"
          alt=""
        />
      </el-table-column>
      <!-- 合约地址 -->
      <el-table-column :label="$t('currency.contractAddress')" align="center">
        <span slot-scope="scope">
          {{ scope.row.contractAddress || '--' }}
        </span>
      </el-table-column>
      <!-- 钱包 -->
      <el-table-column :label="$t('userList.wallet')" align="center">
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor':
                scope.row.walletNumber && scope.row.walletNumber > 0,
            },
          ]"
          @click="
            scope.row.walletNumber && scope.row.walletNumber > 0
              ? showTableFun(scope.row, 'wallets')
              : ''
          "
        >
          {{ scope.row.walletNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 算法 -->
      <el-table-column :label="$t('currency.algNumber')" align="center">
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.algNumber,
            },
          ]"
          @click="scope.row.algNumber ? showTableFun(scope.row, 'alg') : ''"
        >
          {{ scope.row.algNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 矿池 -->
      <el-table-column :label="$t('flight.poolServerIds')" align="center">
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.poolNumber,
            },
          ]"
          @click="scope.row.poolNumber ? showTableFun(scope.row, 'pool') : ''"
        >
          {{ scope.row.poolNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 挖矿软件 -->
      <el-table-column :label="$t('flight.miningName')" align="center">
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.miningSoftwareNumber,
            },
          ]"
          @click="
            scope.row.miningSoftwareNumber
              ? showTableFun(scope.row, 'soft')
              : ''
          "
        >
          {{ scope.row.miningSoftwareNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('farmList.frozenState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'FORZEN' },
            { colorNine: scope.row.enableStatus === 'REMOVE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
        </span>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('userList.operate')" align="center">
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="showPopup(scope.row)"
          >
            {{ $t('currency.edit') }}
          </span>
          <span
            class="blueColor publick-button  cursor"
            @click="coinConfigUpdateApi(scope.row)"
            v-if="scope.row.enableStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="coinConfigUpdateApi(scope.row)"
            v-else-if="scope.row.enableStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span class="publick-button" v-else>
            --
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="coinConfigDeleteApi(scope.row)"
          >
            {{ $t('currency.delete') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userMinerPage && userMinerPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userMinerPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <currencyDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <miningSoftwareList
      v-if="showTable === 'soft' && showPopupDialog"
      :coinName="coinNamePopup"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <walletsList
      v-if="showTable === 'wallets' && showPopupDialog"
      :coinId="coinId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <algorithmList
      v-if="showTable === 'alg' && showPopupDialog"
      :coin="coinNamePopup"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <poolList
      v-if="showTable === 'pool' && showPopupDialog"
      :coinId="coinId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import currencyDetails from './currencyDetails.vue';
import pagination from '../../../mixins/pagination';
import walletsList from '../../dataManagement/userList/table/walletsList.vue';
import algorithmList from '../../dataManagement/userList/table/algorithmList.vue';
import poolList from '../../dataManagement/userList/table/poolList.vue';
import miningSoftwareList from '../../dataManagement/userList/table/miningSoftwareList.vue';
export default {
  name: 'CurrencyList',
  // 模板引入
  components: {
    currencyDetails,
    walletsList,
    algorithmList,
    poolList,
    miningSoftwareList,
  },
  mixins: [pagination],
  // 数据
  data() {
    return {
      coinName: '',
      contractAddress: '',
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
      coinId: '',
      coinNamePopup: '',
      showTable: '',
      showPopupDialog: false,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.detailsDialog = false;
      this.detailsData = null;
      this.coinId = '';
      this.coinNamePopup = '';
      this.showTable = '';
      this.showPopupDialog = false;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.coinConfigPageListApi();
      }
    },
    showTableFun(row, name) {
      if (row && name) {
        this.coinId = row.id;
        this.coinNamePopup = row.coinName;
        this.showTable = name;
        this.showPopupDialog = true;
      }
    },
    showPopup(data = '') {
      this.detailsDialog = true;
      if (data) {
        this.detailsData = data;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      const { page } = this;
      if (page === 1) {
        this.coinConfigPageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.coinConfigPageListApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      return {
        coinName: this.coinName,
        contractAddress: this.contractAddress,
      };
    },
    async coinConfigPageListApi(isSearch = true) {
      const search = this.searchFun();
      let { page, size } = this;
      if (isSearch) {
        page = 1;
      }
      const data = {
        ...{
          size,
          page,
        },
        ...search,
      };
      const res = await this.$http.coinConfigPageList(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async coinConfigUpdateApi(data) {
      const res = await this.$http.coinConfigUpdate({
        id: data.id,
        enableStatus: data.enableStatus === 'NORMAL' ? 'FORZEN' : 'NORMAL',
      });
      if (res) {
        if (data.enableStatus === 'NORMAL') {
          this.$message.success(
            this.$t('userList.FORZENSUC').replace(/{name}/, data.coinName)
          );
        } else {
          this.$message.success(
            this.$t('userList.unblockSuc').replace(/{name}/, data.coinName)
          );
        }
        this.coinConfigPageListApi();
      }
    },
    async coinConfigDeleteApi(data) {
      const res = await this.$http.coinConfigDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.coinName)
        );
        this.coinConfigPageListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.coinConfigPageListApi();
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
.coinImage {
  max-width: 20px;
  max-height: 20px;
}
</style>
