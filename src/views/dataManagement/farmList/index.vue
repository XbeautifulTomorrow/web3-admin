<template>
  <div class="farm-list public-css">
    <div class="public-list-inputs">
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.farmId')}`"
        v-model.number="id"
        clearable
      />
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('farmList.mineName')}`"
        v-model="farmName"
        clearable
      />
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.userID')}`"
        v-model.number="userId"
        clearable
      />
      <el-select
        v-model="useStatus"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('farmList.useStatus')}`"
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
      <!-- @change="changeLanguage" -->
      <!-- disabled -->
      <!-- <el-select
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
      </el-select> -->
      <div class="public-date-box">
        <span class="demonstration">{{ $t('farmList.creationTime') }}:</span>
        <el-date-picker
          v-model="registrationTime"
          type="daterange"
          :range-separator="$t('public.to')"
          :start-placeholder="$t('public.startDate')"
          :end-placeholder="$t('public.endDate')"
        >
        </el-date-picker>
      </div>
      <div class="public-date-box">
        <span class="demonstration">{{ $t('farmList.removalTime') }}:</span>
        <el-date-picker
          v-model="endRemove"
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
        @click="userFarmPageApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <ul class="farm-list-totals public-totals" v-if="totalsObj">
      <li class="farm-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMine') }}:</span>
        <span class="greenColor">{{ totalsObj.farmNumber || '--' }}</span>
      </li>
      <li class="farm-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMiner') }}:</span>
        <span class="greenColor">{{ totalsObj.minerNumber || '--' }}</span>
      </li>
      <li class="farm-list-totals-list public-totals-list">
        <span>{{ $t('userList.minerOnline') }}:</span>
        <span class="greenColor">
          {{ totalsObj.onlineMinerNumber || '--' }}
        </span>
      </li>
      <li class="farm-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalGraphicsCard') }}:</span>
        <span class="greenColor">{{ totalsObj.cardNumber || '--' }}</span>
      </li>
      <li class="farm-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalComputingPower') }}:</span>
        <span class="greenColor">
          {{ Object.formatHashSize(totalsObj.powers, 2).number }}
          {{ Object.formatHashSize(totalsObj.powers, 1).digit }}
        </span>
      </li>
    </ul>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="public-table"
      border
      @sort-change="sortChange"
    >
      <!-- ID -->
      <el-table-column
        sortable="custom"
        prop="id"
        :label="$t('farmList.id')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.id || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center" width="100">
        <span slot-scope="scope">{{ scope.row.farmName || '--' }}</span>
      </el-table-column>
      <!-- 所属用户ID -->
      <el-table-column
        prop="userId"
        :label="$t('farmList.owningUserID')"
        align="center"
        width="90"
      >
        <span slot-scope="scope">
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 矿机 -->
      <el-table-column
        prop="minerNumber"
        :label="$t('farmList.miner')"
        sortable="custom"
        align="center"
        width="90"
      >
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.minerNumber,
            },
          ]"
          @click="scope.row.minerNumber ? showTableFun(scope.row, 'miner') : ''"
        >
          {{ scope.row.minerNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 在线矿机 -->
      <el-table-column
        prop="onlineMinerNumber"
        :label="$t('userList.minerOnline')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.onlineMinerNumber,
            },
          ]"
          @click="
            scope.row.onlineMinerNumber ? showTableFun(scope.row, 'onLine') : ''
          "
        >
          {{ scope.row.onlineMinerNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 显卡 -->
      <el-table-column
        prop="cardNumber"
        :label="$t('userList.graphicsCard')"
        sortable="custom"
        align="center"
      >
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.cardNumber,
            },
          ]"
          @click="scope.row.cardNumber ? showTableFun(scope.row, 'card') : ''"
        >
          {{ scope.row.cardNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 当前算力 -->
      <el-table-column
        prop="powers"
        :label="$t('farmList.currentHashrate')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ Object.formatHashSize(scope.row.powers, 1).number }}
          {{ Object.formatHashSize(scope.row.powers, 1).digit }}
        </span>
      </el-table-column>
      <!-- 余额
      <el-table-column
        :label="$t('userList.balance')"
        sortable="custom"
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.number || '--' }}</span>
      </el-table-column>

      单日支出
      <el-table-column
        :label="$t('userList.dailySpending')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span slot-scope="scope">{{ scope.row.number || '--' }}</span>
      </el-table-column>
      总支出
      <el-table-column
        :label="$t('userList.totalExpenses')"
        sortable="custom"
        align="center"
        width="90"
      >
        <span slot-scope="scope">{{ scope.row.number || '--' }}</span>
      </el-table-column> -->
      <!-- 创建时间 -->
      <el-table-column
        :label="$t('farmList.creationTime')"
        prop="createTime"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <p>{{ timeFormateFun(scope.row.createTime).date }}</p>
          <p v-if="scope.row.createTime">
            {{ timeFormateFun(scope.row.createTime).time }}
          </p>
        </template>
      </el-table-column>
      <!-- 移除时间 -->
      <el-table-column
        :label="$t('farmList.removalTime')"
        prop="removeTime"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <p>{{ timeFormateFun(scope.row.removeTime).date }}</p>
          <p v-if="scope.row.removeTime">
            {{ timeFormateFun(scope.row.removeTime).time }}
          </p>
        </template>
      </el-table-column>
      <!-- 所属时区 -->
      <el-table-column
        prop="timeZone"
        :label="$t('farmList.ownTimeZone')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.timeZone || '--' }}
        </span>
      </el-table-column>
      <!-- 行为记录 -->
      <!-- <el-table-column
        
        :label="$t('farmList.behaviorRecord')"
        align="center"
        width="100"
      >
        <span class="blueColor">
          {{ $t('farmList.clickView') }}
        </span>
      </el-table-column> -->
      <!-- 当前状态 -->
      <!-- <el-table-column :label="$t('userList.currentState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'DISABLE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
        </span>
      </el-table-column> -->
      <!-- 冻结状态 -->
      <el-table-column :label="$t('farmList.useStatus')" align="center">
        <span
          :class="[
            { greenColor: scope.row.useStatus === 'NORMAL' },
            { redColor: scope.row.useStatus === 'REMOVE' },
            { colorNine: scope.row.useStatus === 'FORZEN' },
          ]"
          slot-scope="scope"
        >
          {{
            $t(
              `userList.${
                scope.row.useStatus === 'FORZEN'
                  ? 'DISABLE'
                  : scope.row.useStatus
              }`
            )
          }}
        </span>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="userFarmFrozenApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.DISABLE') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="userFarmRelieveFrozenApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.ENABLE') }}
          </span>
          <span v-else class="publick-button">--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userFarmPage && userFarmPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userFarmPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <minerList
      v-if="
        showTable === 'miner' || (showTable === 'onLine' && showPopupDialog)
      "
      :farmId="farmId"
      :runStatus="runStatus"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <graphicsCardList
      v-if="showTable === 'card' && showPopupDialog"
      :farmId="farmId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { timeForStr } from '../../../utils';
import { tzTimeFormate } from '../../../filters';
import pagination from '../../../mixins/pagination';
import minerList from '../userList/table/minerList.vue';
import graphicsCardList from '../userList/table/graphicsCardList.vue';
export default {
  name: 'MineList',
  // 模板引入
  components: { minerList, graphicsCardList },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      farmName: '',
      userId: '',
      enableStatus: '',
      size: 20,
      page: 1,
      orderBy: '',
      orderType: '',
      useStatus: '',
      registrationTime: '',
      endRemove: '',
      totalsObj: null,
      tableData: [],
      userFarmPage: null,
      stateOptions: [
        {
          value: 'NORMAL',
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 'FORZEN',
          label: this.$t('userList.DISABLE'),
        },
        {
          value: 'REMOVE',
          label: this.$t('userList.REMOVE'),
        },
      ],
      suspendedStatusOptions: [
        {
          value: 'NORMAL',
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 'DISABLE',
          label: this.$t('userList.FORZEN'),
        },
      ],
      farmId: '',
      showTable: '',
      runStatus: '',
      showPopupDialog: false,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.farmId = '';
      this.showTable = '';
      this.runStatus = '';
      this.showPopupDialog = false;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.userFarmPageApi();
      }
    },
    showTableFun(row, name) {
      if (row && name) {
        this.farmId = row.id;
        this.showTable = name;
        if (name === 'onLine') {
          this.runStatus = 'ONLINE';
        } else {
          this.runStatus = '';
        }
        this.showPopupDialog = true;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.userFarmPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userFarmPageApi(false);
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
      this.userFarmPageApi();
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      let { registrationTime, endRemove } = this;
      let startCreateTime = '';
      let endCreateTime = '';
      let startRemoveTime = '';
      let endRemoveTime = '';
      if (registrationTime && registrationTime[0]) {
        startCreateTime = timeForStr(registrationTime[0], 'YYYY-MM-DD');
      }
      if (registrationTime && registrationTime[1]) {
        endCreateTime = timeForStr(registrationTime[1], 'YYYY-MM-DD');
      }
      if (endRemove && endRemove[0]) {
        startRemoveTime = timeForStr(endRemove[0], 'YYYY-MM-DD');
      }
      if (endRemove && endRemove[1]) {
        endRemoveTime = timeForStr(endRemove[1], 'YYYY-MM-DD');
      }
      return {
        id: this.id,
        farmName: this.farmName,
        userId: this.userId,
        useStatus: this.useStatus,
        orderBy: this.orderBy,
        orderType: this.orderType,
        enableStatus: this.enableStatus,
        startCreateTime,
        endCreateTime,
        startRemoveTime,
        endRemoveTime,
      };
    },
    async userFarmDataTotalApi(data) {
      const _data = Object.copyArrObj(data);
      delete _data.orderBy;
      delete _data.orderType;
      const res = await this.$http.userFarmDataTotal(_data);
      if (res) {
        this.totalsObj = res;
      }
    },
    async userFarmPageApi(isSearch = true) {
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
      const res = await this.$http.userFarmPage(data);
      if (res) {
        this.userFarmPage = res;
        this.tableData = res.records;
      }
      this.userFarmDataTotalApi(search);
    },
    async userFarmFrozenApi(data) {
      const res = await this.$http.userFarmFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.prohibitSUC').replace(/{name}/, data.farmName)
        );
        this.userFarmPageApi();
      }
    },
    async userFarmRelieveFrozenApi(data) {
      const res = await this.$http.userFarmRelieveFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.DISABLESUC').replace(/{name}/, data.farmName)
        );
        this.userFarmPageApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userFarmPageApi();
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
