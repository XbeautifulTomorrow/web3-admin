<template>
  <div class="overclock-list public-css">
    <div class="public-list-inputs">
      <!-- 模板名称 -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('overclock.templateName')}`"
        v-model="templateName"
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
        @click="templatePageApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="public-table"
      border
      @sort-change="sortChange"
    >
      <!-- ID -->
      <el-table-column prop="id" :label="$t('farmList.id')" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.id || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.templateName || '--' }}</span>
      </el-table-column>
      <!-- 用户ID -->
      <el-table-column :label="$t('farmList.owningUserID')" align="center">
        <span slot-scope="scope">{{ scope.row.userId || '--' }}</span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column :label="$t('minerList.farmId')" align="center">
        <span slot-scope="scope" v-if="scope.row.farmId">
          {{ scope.row.farmId }}
        </span>
        <span slot-scope="scope" v-else-if="scope.row.globalStatus === 'TRUE'">
          {{ $t('wallet.global') }}
        </span>
        <span>--</span>
      </el-table-column>
      <!-- 模板详情 -->
      <el-table-column
        :label="$t('overclock.templateGlobalDetail')"
        align="center"
      >
        <template slot-scope="scope" v-if="scope.row.templateGlobalDetail">
          <div
            v-for="(item, index) in scope.row.templateGlobalDetail"
            class="blueColor cursor"
            :key="`templateGlobalDetail-${index}`"
          >
            <p
              v-if="item.defaultStatus === 'TRUE'"
              @click="showPopup(scope.row.templateGlobalDetail)"
            >
              {{ $t('overclock.defaultStatus') }}
            </p>
            <p
              @click="
                showPopup(scope.row.templateGlobalDetail, item.algorithmName)
              "
            >
              {{ item.algorithmName }}
            </p>
          </div>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 矿机数 -->
      <el-table-column :label="$t('overclock.appNumber')" align="center">
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor':
                scope.row.appNumber && scope.row.appNumber > 0,
            },
          ]"
          @click="
            scope.row.appNumber && scope.row.appNumber > 0
              ? showTableFun(scope.row, 'miner')
              : ''
          "
        >
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
    <overclockDetails
      v-if="detailsDialog && detailsData"
      :popupDialog="detailsDialog"
      :algorithmName="algorithmName"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <minerList
      v-if="showTable === 'miner' && showPopupDialog"
      :templateId="templateId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import overclockDetails from './overclockDetails.vue';
import pagination from '../../../mixins/pagination';
import minerList from '../userList/table/minerList.vue';
export default {
  name: 'OverclockList',
  // 模板引入
  components: { overclockDetails, minerList },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      templateName: '',
      userId: '',
      farmId: '',
      strikeOut: '',
      algorithmName: '',
      tableData: [],
      userMinerPage: null,
      templateId: '',
      showTable: '',
      showPopupDialog: false,
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
      this.algorithmName = '';
      this.templateId = '';
      this.showTable = '';
      this.showPopupDialog = false;
    },
    showPopup(data, algorithmName) {
      this.detailsDialog = true;
      this.detailsData = data;
      this.algorithmName = algorithmName;
    },
    showTableFun(row, name) {
      if (row && name) {
        this.showTable = name;
        this.templateId = row.id;
        this.showPopupDialog = true;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.templatePageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.templatePageApi(false);
    },
    sortChange(data) {
      const { order, prop } = data;
      if (order === 'descending') {
        this.orderBy = prop;
        this.orderType = 'DESC';
      } else if (order === 'ascending') {
        this.orderBy = prop;
        this.orderType = 'ASC';
      } else {
        this.orderBy = '';
        this.orderType = '';
      }
      this.templatePageApi();
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      return {
        id: this.id,
        templateName: this.templateName,
        userId: this.userId,
        farmId: this.farmId,
        strikeOut: this.strikeOut,
      };
    },
    async templatePageApi(isSearch = true) {
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
      const res = await this.$http.templatePage(data);
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
    this.templatePageApi();
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
