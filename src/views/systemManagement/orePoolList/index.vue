<template>
  <div class="orePool-list public-css">
    <div class="public-list-inputs pbulic-space-between">
      <div class="publick-search-list">
        <!-- 输入名称 -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('orePool.poolName')}`"
          v-model="poolName"
          clearable
        />
        <!-- 币种Id -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('wallet.coinId')}`"
          v-model="coinId"
          clearable
        />
        <el-select
          v-model="enableStatus"
          class="public-select-box"
          popper-class="public-select-box"
          :placeholder="`${$t('public.select')}${$t('userList.currentState')}`"
          clearable
        >
          <el-option
            v-for="item in suspendedStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="public-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="public-search"
          @click="orePoolPageListApi"
        >
          {{ $t('public.search') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopup(null)"
        >
          {{ $t('orePool.addOrePool') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.poolName || '--' }}</span>
      </el-table-column>
      <!-- 支持币种 -->
      <el-table-column :label="$t('algorithm.coinIds')" align="center">
        <template
          slot-scope="scope"
          v-if="scope.row.coins && scope.row.coins.length > 0"
        >
          <p
            class="coin-list"
            v-for="(item, index) in scope.row.coins"
            :key="`coins-${index}`"
          >
            <img :src="item.coinImage" alt="" class="icon" />
            <span>{{ item.coinName }}</span>
          </p>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 相关URL -->
      <el-table-column
        :label="$t('orePool.orePoolServers')"
        align="center"
        width="200"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.orePoolServers && scope.row.orePoolServers.length > 0"
        >
          <p
            v-for="(item, index) in scope.row.orePoolServers"
            :key="`orePoolServers-${index}`"
          >
            <span>[{{ item.serverName }}]</span>
            <span>{{ item.serverUrl }}</span>
          </p>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 启动器 -->
      <el-table-column :label="$t('minerList.launcher')" align="center">
        <span slot-scope="scope">
          {{ scope.row.flightNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('userList.currentState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'DISABLE' },
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
            @click="orePoolProhibitApi(scope.row)"
            v-if="scope.row.enableStatus === 'NORMAL'"
          >
            {{ $t('userList.DISABLE') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="orePoolEnableApi(scope.row)"
            v-else-if="scope.row.enableStatus === 'DISABLE'"
          >
            {{ $t('userList.ENABLE') }}
          </span>
          <span v-else class="publick-button">
            --
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="orePoolDeleteApi(scope.row)"
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
    <orePoolDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import pagination from '../../../mixins/pagination';
import orePoolDetails from './orePoolDetails.vue';
export default {
  name: 'OrePoolList',
  // 模板引入
  components: { orePoolDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      poolName: '',
      coinId: '',
      enableStatus: '',
      options: [],
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
      suspendedStatusOptions: [
        {
          value: 'NORMAL',
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 'DISABLE',
          label: this.$t('userList.DISABLE'),
        },
      ],
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
        this.orePoolPageListApi();
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
        this.orePoolPageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.orePoolPageListApi(false);
    },
    graphicsCardChangeFun(card) {
      this.orePoolPageListApi();
    },
    searchFun() {
      return {
        poolName: this.poolName,
        coinId: this.coinId,
        enableStatus: this.enableStatus,
      };
    },
    async algorithmBaseFindListApi() {
      const res = await this.$http.algorithmBaseFindList();
      if (res) {
        this.options = res;
      }
    },
    async orePoolPageListApi(isSearch = true) {
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
      const res = await this.$http.orePoolPageList(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async orePoolProhibitApi(data) {
      const res = await this.$http.orePoolProhibit({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.FORZENSUC').replace(/{name}/, data.poolName)
        );
        this.orePoolPageListApi();
      }
    },
    async orePoolEnableApi(data) {
      const res = await this.$http.orePoolEnable({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.DISABLESUC').replace(/{name}/, data.poolName)
        );
        this.orePoolPageListApi();
      }
    },
    async orePoolDeleteApi(data) {
      const res = await this.$http.orePoolDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.poolName)
        );
        this.orePoolPageListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.orePoolPageListApi();
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
.coin-list {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 3px;
}
</style>
