<template>
  <div class="systemVersionManagement-list public-css">
    <div class="public-list-inputs">
      <!-- ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
        v-model.number="id"
        clearable
      />
      <!-- 系统版本 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('minerList.systemVersion')}`"
        v-model="systemVersion"
        clearable
      />
      <div class="public-date-box">
        <span class="demonstration">
          {{ $t('systemVersionManagement.creationTime') }}:
        </span>
        <el-date-picker
          v-model="registrationTime"
          type="daterange"
          :range-separator="$t('public.to')"
          :start-placeholder="$t('public.startDate')"
          :end-placeholder="$t('public.endDate')"
        >
        </el-date-picker>
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="public-search"
        @click="systemVersionManagerPageListApi"
      >
        {{ $t('public.search') }}
      </el-button>
      <el-button type="success" class="public-search" @click="showPopup(null)">
        {{ $t('systemVersionManagement.addSystemVersionManagement') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.id')" align="center">
        <span slot-scope="scope">{{ scope.row.id || '--' }}</span>
      </el-table-column>
      <!-- 版本号 -->
      <el-table-column
        :label="$t('systemVersionManagement.systemVersion')"
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.systemVersion || '--' }}</span>
      </el-table-column>
      <!-- 版本说明 -->
      <el-table-column
        :label="$t('systemVersionManagement.remark')"
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.remark || '--' }}</span>
      </el-table-column>
      <!-- 下载链接 -->
      <el-table-column
        :label="$t('systemVersionManagement.downloadUrl')"
        align="center"
      >
        <a
          slot-scope="scope"
          :href="scope.row.downloadUrl || 'javascript:void(0);'"
          class="blueColor"
          target="_blank"
        >
          {{ scope.row.downloadUrl || '--' }}
        </a>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column
        :label="$t('systemVersionManagement.creationTime')"
        align="center"
      >
        <span slot-scope="scope">
          {{ timeFormateFun(scope.row.createTime).date }}
        </span>
      </el-table-column>
      <!-- 当前状态 -->
      <!-- <el-table-column :label="$t('farmList.frozenState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.strikeOut === 0 },
            { colorNine: scope.row.strikeOut === 1 },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
        </span>
      </el-table-column> -->
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
            v-if="scope.row.strikeOut === 0"
            class="blueColor publick-button cursor"
            @click="systemVersionManagerDeleteApi(scope.row)"
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
    <systemVersionManagementListDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import { timeForStr } from '../../../utils';
import pagination from '../../../mixins/pagination';
import systemVersionManagementListDetails from './systemVersionManagementListDetails.vue';
export default {
  name: 'SystemVersionManagementList',
  // 模板引入
  components: { systemVersionManagementListDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      systemVersion: '',
      registrationTime: '',
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
        this.systemVersionManagerPageListApi();
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
        this.systemVersionManagerPageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.systemVersionManagerPageListApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      let { registrationTime } = this;
      let startCreateTime = '';
      let endCreateTime = '';
      if (registrationTime && registrationTime[0]) {
        startCreateTime = timeForStr(registrationTime[0], 'YYYY-MM-DD');
      }
      if (registrationTime && registrationTime[1]) {
        endCreateTime = timeForStr(registrationTime[1], 'YYYY-MM-DD');
      }
      return {
        id: this.id,
        systemVersion: this.systemVersion,
        startCreateTime,
        endCreateTime,
      };
    },
    async systemVersionManagerPageListApi(isSearch = true) {
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
      const res = await this.$http.systemVersionManagerPageList(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async systemVersionManagerDeleteApi(data) {
      const res = await this.$http.systemVersionManagerDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.coinName)
        );
        this.systemVersionManagerPageListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.systemVersionManagerPageListApi();
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
