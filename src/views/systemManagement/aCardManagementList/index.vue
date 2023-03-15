<template>
  <div class="aCardManagement-list public-css">
    <div class="public-list-inputs">
      <!-- ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
        v-model.number="id"
        clearable
      />
      <!-- 显卡名称 -->
      <el-input
        class="public-input"
        :placeholder="
          `${$t('public.write')}${$t('graphicsCardList.graphicsCardName')}`
        "
        v-model="graphicsCardName"
        clearable
      />
      <!-- 核心频率 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.coreClockOffset')}`"
        v-model.number="coreClockOffset"
        clearable
      />
      <!-- 核心电压 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.coreVoltage')}`"
        v-model.number="coreVoltage"
        clearable
      />
      <!-- 显存频率 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.memoryFrequency')}`"
        v-model.number="memoryFrequency"
        clearable
      />
      <!-- 功耗限制 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.powerLimit')}`"
        v-model.number="powerLimit"
        clearable
      />
      <!-- 风扇 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.fan')}`"
        v-model.number="fan"
        clearable
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="public-search"
        @click="defaultCardConfigPageListApi"
      >
        {{ $t('public.search') }}
      </el-button>
      <el-button type="success" class="public-search" @click="showPopup(null)">
        {{ $t('overclockPresets.addPresets') }}
      </el-button>
      <el-upload
        class="public-upload public-search"
        :action="origin"
        :headers="headers"
        :limit="1"
        :file-list="fileList"
        accept=".xlsx"
        :show-file-list="false"
        :on-success="successFun"
        :on-error="errorFun"
      >
        <el-button type="success">
          {{ $t('aCardManagement.import') }}
        </el-button>
      </el-upload>
      <el-button
        type="success"
        class="public-search"
        @click="defaultCardConfigExportTemplateApi"
      >
        {{ $t('aCardManagement.export') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column :label="$t('farmList.id')" align="center">
        <span slot-scope="scope">{{ scope.row.id || '--' }}</span>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.graphicsCardName || '--' }}</span>
      </el-table-column>
      <!-- 核心频率 -->
      <el-table-column :label="$t('overclock.coreClockOffset')" align="center">
        <span slot-scope="scope">{{ scope.row.coreClockOffset || '--' }}</span>
      </el-table-column>
      <!-- 显存频率 -->
      <el-table-column :label="$t('overclock.memoryFrequency')" align="center">
        <span slot-scope="scope">{{ scope.row.memoryFrequency || '--' }}</span>
      </el-table-column>
      <!-- 核心电压 -->
      <el-table-column :label="$t('overclock.coreVoltage')" align="center">
        <span slot-scope="scope">{{ scope.row.coreVoltage || '--' }}</span>
      </el-table-column>
      <!-- 最大功耗 -->
      <el-table-column :label="$t('aCardManagement.powerLimit')" align="center">
        <span slot-scope="scope">{{ scope.row.powerLimit || '--' }}</span>
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
            class="blueColor publick-button cursor"
            @click="defaultCardConfigDeleteApi(scope.row)"
          >
            {{ $t('currency.delete') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="useraCardManagementPage && useraCardManagementPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="useraCardManagementPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <aCardManagementDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import pagination from '../../../mixins/pagination';
import aCardManagementDetails from './aCardManagementDetails.vue';
export default {
  name: 'ACardManagementList',
  // 模板引入
  components: { aCardManagementDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      graphicsCardName: '',
      id: '',
      coreClockOffset: '',
      coreVoltage: '',
      memoryFrequency: '',
      powerLimit: '',
      fan: '',
      tableData: [],
      useraCardManagementPage: null,
      size: 20,
      page: 1,
      overclockAlgorithmID: '',
      overclockDetailsDialog: false,
      detailsDialog: false,
      detailsData: null,
      fileList: [],
      origin:
        window.location.origin.indexOf('localhost') > -1
          ? 'http://221.236.31.34:13082/operation-web-admin/default-card-config/import'
          : window.location.origin +
            '/operation-web-admin/default-card-config/import',
      headers: { certificate: sessionStorage.getItem('token') },
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
        this.defaultCardConfigPageListApi();
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
        this.defaultCardConfigPageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.defaultCardConfigPageListApi(false);
    },
    searchFun() {
      return {
        graphicsCardName: this.graphicsCardName,
        id: this.id,
        coreClockOffset: this.coreClockOffset,
        coreVoltage: this.coreVoltage,
        memoryFrequency: this.memoryFrequency,
        powerLimit: this.powerLimit,
        fan: this.fan,
      };
    },
    async defaultCardConfigPageListApi(isSearch = true) {
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
      const res = await this.$http.defaultCardConfigPageList(data);
      if (res) {
        this.useraCardManagementPage = res;
        this.tableData = res.records;
      }
    },
    async defaultCardConfigDeleteApi(data) {
      const res = await this.$http.defaultCardConfigDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.graphicsCardName)
        );
        this.defaultCardConfigPageListApi();
      }
    },
    defaultCardConfigExportTemplateApi() {
      this.$http.defaultCardConfigExportTemplate();
    },
    successFun() {
      this.$message.success(this.$t('aCardManagement.importSuc'));
    },
    errorFun() {
      this.$message.error(this.$t('aCardManagement.importError'));
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.defaultCardConfigPageListApi();
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
.public-search {
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
}
.public-input {
  width: 180px;
}
</style>
