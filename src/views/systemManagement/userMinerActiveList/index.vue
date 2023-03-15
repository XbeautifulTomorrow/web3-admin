<template>
  <div class="userMinerActive-list public-css">
    <div class="public-list-inputs">
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('userMinerActive.id')}`"
        v-model.number="id"
        clearable
      />
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('userMinerActive.title')}`"
        v-model="title"
        clearable
      />
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('userMinerActive.farmId')}`"
        v-model.number="farmId"
        clearable
      />
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('userMinerActive.userId')}`"
        v-model.number="userId"
        clearable
      />
      <!-- 结果 -->
      <el-select
        v-model="logLevel"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="
          `${$t('public.select')}${$t('userMinerActive.runLogLevel')}`
        "
        clearable
      >
        <el-option
          v-for="item in logLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 活动类型 -->
      <el-select
        v-model="activityType"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="
          `${$t('public.select')}${$t('userMinerActive.titleOther')}`
        "
        clearable
      >
        <el-option
          v-for="item in activityTypeOptions"
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
        @click="userMinerActivePageListApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- 操作者ID -->
      <el-table-column
        prop="userId"
        :label="$t('userMinerActive.userId')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.userId || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 目标账户 -->
      <el-table-column
        prop="id"
        :label="$t('userMinerActive.id')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.id || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 目标矿场 -->
      <el-table-column
        prop="farmId"
        :label="$t('userMinerActive.farmId')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.farmId || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 目标矿机 -->
      <el-table-column
        prop="minerId"
        :label="$t('userMinerActive.minerId')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.minerId || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 操作显卡 -->
      <!-- 操作时间 -->
      <el-table-column
        prop="sendTime"
        :label="$t('userMinerActive.sendTime')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ timeFormateFun(scope.row.sendTime).date }}</p>
          <p v-if="scope.row.sendTime">
            {{ timeFormateFun(scope.row.sendTime).time }}
          </p>
        </template>
      </el-table-column>
      <!-- 行为 -->
      <el-table-column
        prop="title"
        :label="$t('userMinerActive.titleOther')"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ $t(`userMinerActive.${scope.row.activityType}`) || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 操作细节 -->
      <el-table-column
        :label="$t('userMinerActive.operationDetails')"
        align="center"
      >
        <span
          v-if="scope.row.returnValueStatus === 'TRUE'"
          slot-scope="scope"
          class="blueColor cursor"
          @click="openPopupFun(scope.row)"
        >
          {{ $t('public.check') }}
        </span>
        <span v-else>--</span>
      </el-table-column>
      <!-- 结果 -->
      <el-table-column
        prop="logLevel"
        :label="$t('userMinerActive.logLevel')"
        align="center"
      >
        <span
          slot-scope="scope"
          :class="[
            { greenColor: scope.row.logLevel === 'SUCCESS' },
            { orangeColor: scope.row.logLevel === 'DANGER' },
            { redColor: scope.row.logLevel === 'WARNING' },
            { blueColor: scope.row.logLevel === 'FILE' },
            { colorNine: scope.row.logLevel === 'INFO' },
          ]"
        >
          {{ $t(`userMinerActive.${scope.row.logLevel}`) }}
        </span>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userMinerActivePageList && userMinerActivePageList.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userMinerActivePageList.total"
      class="public-pagination"
    >
    </el-pagination>
    <userMinerActiveListDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import pagination from '../../../mixins/pagination';
import { tzTimeFormate } from '../../../filters';
import userMinerActiveListDetails from './userMinerActiveListDetails.vue';
export default {
  name: 'UserMinerActiveList',
  // 模板引入
  components: { userMinerActiveListDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      title: '',
      logLevel: '',
      userId: '',
      farmId: '',
      activityType: '',
      size: 20,
      page: 1,
      tableData: [],
      userMinerActivePageList: null,
      detailsData: null,
      detailsDialog: false,
      logLevelOptions: [
        {
          value: 'SUCCESS',
          label: this.$t('userMinerActive.SUCCESS'),
        },
        {
          value: 'WARNING',
          label: this.$t('userMinerActive.WARNING'),
        },
        {
          value: 'DANGER',
          label: this.$t('userMinerActive.DANGER'),
        },
        {
          value: 'FILE',
          label: this.$t('userMinerActive.FILE'),
        },
        {
          value: 'INFO',
          label: this.$t('userMinerActive.INFO'),
        },
      ],
      activityTypeOptions: [
        {
          value: 'CONFIG_APPLIED',
          label: this.$t('userMinerActive.CONFIG_APPLIED'),
        },
        {
          value: 'WORKER_CREATED',
          label: this.$t('userMinerActive.WORKER_CREATED'),
        },
        {
          value: 'WORKER_TRANSFERED_TO',
          label: this.$t('userMinerActive.WORKER_TRANSFERED_TO'),
        },
        {
          value: 'WORKER_TRANSFERED_FROM',
          label: this.$t('userMinerActive.WORKER_TRANSFERED_FROM'),
        },
        {
          value: 'COMMAND_SENT',
          label: this.$t('userMinerActive.COMMAND_SENT'),
        },
      ],
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup() {
      this.detailsDialog = false;
      this.detailsData = null;
    },
    openPopupFun(data) {
      this.detailsDialog = true;
      if (data) {
        this.detailsData = data;
      }
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    handleSizeChange(val) {
      this.size = val;
      this.userMinerActivePageListApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userMinerActivePageListApi(false);
    },
    searchFun() {
      return {
        id: this.id,
        farmId: this.farmId,
        userId: this.userId,
        title: this.title,
        logLevel: this.logLevel,
        activityType: this.activityType,
      };
    },
    async userMinerActivePageListApi(isSearch = true) {
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
      const res = await this.$http.userMinerActivePageList(data);
      if (res) {
        this.userMinerActivePageList = res;
        this.tableData = res.records;
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userMinerActivePageListApi();
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
.userMinerActive-list-totals-list {
  :first-child {
    margin-right: 5px;
  }
}
</style>
