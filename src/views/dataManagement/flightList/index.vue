<template>
  <div class="flight-list public-css">
    <div class="public-list-inputs">
      <!-- 模板名称 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('flight.flightName')}`"
        v-model="flightName"
        clearable
      />
      <!-- 输入ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
        v-model.number="id"
        clearable
      />
      <!-- 输入用户ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.userID')}`"
        v-model.number="userId"
        clearable
      />
      <!-- 输入矿场ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.farmId')}`"
        v-model.number="farmId"
        clearable
      />
      <el-select
        v-model="strikeOut"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('userList.state')}`"
        clearable
      >
        <el-option
          v-for="item in stateOptions"
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
        @click="flightSheetBasePageApi"
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
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.flightName || '--' }}</span>
      </el-table-column>
      <!-- 用户ID -->
      <el-table-column :label="$t('farmList.userID')" align="center">
        <span slot-scope="scope">{{ scope.row.userId || '--' }}</span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column :label="$t('minerList.farmId')" align="center">
        <span slot-scope="scope">
          {{ scope.row.farmId || '--' }}
        </span>
      </el-table-column>
      <!-- 启动器详情 -->
      <el-table-column :label="$t('flight.flightSheets')" align="center">
        <span
          v-if="scope.row.flightSheets && scope.row.flightSheets.length > 0"
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor':
                scope.row.flightSheets && scope.row.flightSheets.length > 0,
            },
          ]"
          @click="showPopup(scope.row)"
        >
          {{ $t('farmList.clickView') }}
        </span>
        <span v-else>--</span>
      </el-table-column>
      <!-- 矿机数 -->
      <el-table-column :label="$t('overclock.appNumber')" align="center">
        <span slot-scope="scope">
          {{ scope.row.appNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('userList.state')" align="center">
        <span
          :class="[
            { greenColor: scope.row.strikeOut == 0 },
            { redColor: scope.row.strikeOut == 1 },
          ]"
          slot-scope="scope"
        >
          {{
            scope.row.strikeOut == 0
              ? $t(`userList.NORMAL`)
              : $t('userList.REMOVE')
          }}
        </span>
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
    <flightDetails
      v-if="detailsDialog && detailsData"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import flightDetails from './flightDetails.vue';
import pagination from '../../../mixins/pagination';
export default {
  name: 'FlightList',
  // 模板引入
  components: { flightDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      userId: '',
      farmId: '',
      flightName: '',
      strikeOut: '',
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
      stateOptions: [
        {
          value: 0,
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 1,
          label: this.$t('userList.REMOVE'),
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
    showPopup(data) {
      if (data) {
        const { flightSheets } = data;
        if (!flightSheets || flightSheets.length < 1) {
          return;
        }
      }
      this.detailsDialog = true;
      this.detailsData = data;
    },
    handleSizeChange(val) {
      this.size = val;
      this.flightSheetBasePageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.flightSheetBasePageApi(false);
    },
    searchFun() {
      return {
        id: this.id,
        userId: this.userId,
        farmId: this.farmId,
        flightName: this.flightName,
        strikeOut: this.strikeOut,
      };
    },
    async flightSheetBasePageApi(isSearch = true) {
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
      const res = await this.$http.flightSheetBasePage(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.flightSheetBasePageApi();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped></style>
