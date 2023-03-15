<template>
  <div class="miner-list public-css">
    <div class="public-list-inputs pbulic-space-between">
      <div class="publick-search-list">
        <!-- 算法名称 -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('algorithm.algorithmName')}`"
          v-model="algorithmName"
          clearable
        />
        <!-- 币种名称 -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('algorithm.coin')}`"
          v-model="coin"
          clearable
        />
        <!-- 输入币种 -->
        <!-- 输入合约地址 -->
      </div>
      <div class="public-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="public-search"
          @click="algorithmBasePageListApi"
        >
          {{ $t('public.search') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopup(null)"
        >
          {{ $t('algorithm.addAlgorithm') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column :label="$t('farmList.id')" align="center">
        <span slot-scope="scope">{{ scope.row.id || '--' }}</span>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.algorithmName || '--' }}</span>
      </el-table-column>
      <!-- 相关币种 -->
      <el-table-column :label="$t('algorithm.coins')" align="center">
        <template
          slot-scope="scope"
          v-if="scope.row.coins && scope.row.coins.length > 0"
        >
          <span
            v-for="(item, index) in scope.row.coins"
            :key="`coins-${index}`"
          >
            {{ item.coinName }}
          </span>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 超频模板 -->
      <el-table-column
        :label="$t('minerList.overclockingTemplate')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.templateNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 超频预设 -->
      <el-table-column
        :label="$t('algorithm.overclockingPresets')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.presetsTemplateNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('farmList.frozenState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.useStatus === 'NORMAL' },
            { redColor: scope.row.useStatus === 'FORZEN' },
            { colorNine: scope.row.useStatus === 'REMOVE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.useStatus}`) }}
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
          <!-- <span
            class="blueColor publick-button  cursor"
            @click="algorithmBaseUpdateApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="algorithmBaseUpdateApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span v-else class="publick-button">
            --
          </span> -->
          <span
            class="blueColor publick-button cursor"
            @click="algorithmBaseDeleteApi(scope.row)"
            >{{ $t('currency.delete') }}</span
          >
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
    <algorithmDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import algorithmDetails from './algorithmDetails.vue';
import pagination from '../../../mixins/pagination';
export default {
  name: 'AlgorithmList',
  // 模板引入
  components: { algorithmDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      algorithmName: '',
      coin: '',
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.detailsDialog = false;
      this.detailsData = null;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.algorithmBasePageListApi();
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
        this.algorithmBasePageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.algorithmBasePageListApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      return {
        algorithmName: this.algorithmName,
        coin: this.coin,
      };
    },
    async algorithmBasePageListApi(isSearch = true) {
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
      const res = await this.$http.algorithmBasePageList(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async algorithmBaseUpdateApi(data) {
      const res = await this.$http.algorithmBaseUpdate({
        id: data.id,
        enableStatus: data.enableStatus === 'NORMAL' ? 'FORZEN' : 'NORMAL',
      });
      if (res) {
        if (data.enableStatus === 'NORMAL') {
          this.$message.success(
            this.$t('userList.FORZENSUC').replace(/{name}/, data.algorithmName)
          );
        } else {
          this.$message.success(
            this.$t('userList.unblockSuc').replace(/{name}/, data.algorithmName)
          );
        }
        this.algorithmBasePageListApi();
      }
    },
    async algorithmBaseDeleteApi(data) {
      const res = await this.$http.algorithmBaseDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.algorithmName)
        );
        this.algorithmBasePageListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.algorithmBasePageListApi();
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
