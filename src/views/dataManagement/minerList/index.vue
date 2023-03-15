<template>
  <div class="miner-list">
    <div class="public-list-inputs ">
      <!-- <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('minerList.minerId')}`"
          v-model="id"
          clearable
        /> -->
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('minerList.minerName')}`"
        v-model="minerName"
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
        :placeholder="`${$t('public.select')}${$t('farmList.frozenState')}`"
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
      <el-select
        v-model="runStatus"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('userList.runStatus')}`"
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
        @click="userMinerPageApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <ul class="miner-list-totals public-totals " v-if="totalsObj">
      <li class="miner-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMiner') }}:</span>
        <span class="greenColor">{{ totalsObj.minerNumber || '--' }}</span>
      </li>
      <li class="miner-list-totals-list public-totals-list">
        <span>{{ $t('userList.minerOnline') }}:</span>
        <span class="greenColor">
          {{ totalsObj.onlineMinerNumber || '--' }}
        </span>
      </li>
      <li class="miner-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalGraphicsCard') }}:</span>
        <span class="greenColor">{{ totalsObj.cardNumber || '--' }}</span>
      </li>
      <li class="miner-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalComputingPower') }}:</span>
        <span class="greenColor">
          {{ Object.formatHashSize(totalsObj.powers, 1).number }}
          {{ Object.formatHashSize(totalsObj.powers, 1).digit }}
        </span>
      </li>
    </ul>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="public-table overflow"
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
      <!-- 密码 -->
      <el-table-column
        :label="$t('public.password')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">{{ scope.row.password || '--' }}</span>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center" width="100">
        <span slot-scope="scope">{{ scope.row.minerName || '--' }}</span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column
        :label="$t('minerList.farmId')"
        align="center"
        width="70"
      >
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.farmId,
            },
          ]"
          @click="scope.row.farmId ? showTableFun(scope.row, 'farm') : ''"
        >
          {{ scope.row.farmId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属用户 -->
      <el-table-column
        prop="userId"
        :label="$t('farmList.owningUserID')"
        align="center"
        width="90"
      >
        <span
          slot-scope="scope"
          :class="[
            {
              'blueColor cursor': scope.row.userId,
            },
          ]"
          @click="scope.row.userId ? showTableFun(scope.row, 'user') : ''"
        >
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 显卡 -->
      <el-table-column
        :label="$t('userList.graphicsCard')"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <template
            v-if="scope.row.cardTotals && scope.row.cardTotals.length > 0"
          >
            <p
              v-for="(item, index) in scope.row.cardTotals"
              :key="`cardTotals-${index}`"
              :class="[
                {
                  'blueColor cursor': item.cardName,
                },
              ]"
              @click="item.cardName ? showTableFun(scope.row, 'card') : ''"
            >
              <span>{{ item.cardName }}*{{ item.cardNumber }}</span>
            </p>
          </template>
          <span v-else>--</span>
        </template>
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
      <!-- 核心温度 -->
      <el-table-column
        prop="cpuTemperature"
        :label="$t('minerList.coreTemperature')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.cpuTemperature ? `${scope.row.cpuTemperature}℃` : '--' }}
        </span>
      </el-table-column>
      <!-- 启动器 -->
      <el-table-column
        prop="flightId"
        :label="$t('minerList.launcher')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span
          :class="[
            {
              'blueColor cursor': scope.row.flightId,
            },
          ]"
          slot-scope="scope"
          @click="scope.row.flightId ? handleClick(scope.row, 'flight') : ''"
        >
          {{ scope.row.flightId || '--' }}
        </span>
      </el-table-column>
      <!-- 超频模板 -->
      <el-table-column
        prop="overclockingTemplate"
        :label="$t('minerList.overclockingTemplate')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span
          :class="[
            {
              'blueColor cursor': scope.row.templateId,
            },
          ]"
          slot-scope="scope"
          @click="
            scope.row.templateId ? handleClick(scope.row, 'overclock') : ''
          "
        >
          {{ scope.row.templateId || '--' }}
        </span>
      </el-table-column>
      <!-- 启动时长 -->
      <el-table-column
        :label="$t('minerList.startupTime')"
        prop="minerStartTime"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <p>
            {{ timeDifferenceFun(scope.row.minerStartTime) }}
          </p>
        </template>
      </el-table-column>
      <!-- 挖矿时长 -->
      <el-table-column
        :label="$t('minerList.miningTime')"
        prop="machineStartTime"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <p>{{ timeDifferenceFun(scope.row.machineStartTime) }}</p>
        </template>
      </el-table-column>
      <!-- IP -->
      <el-table-column
        prop="publicIp"
        :label="$t('minerList.IP')"
        align="center"
        width="120"
      >
        <span slot-scope="scope">
          {{ scope.row.publicIp || '--' }}
        </span>
      </el-table-column>
      <!-- 系统版本 -->
      <el-table-column
        prop="systemVersion"
        :label="$t('minerList.systemVersion')"
        align="center"
        width="80"
      >
        <span class="blueColor" slot-scope="scope">
          {{ scope.row.systemVersion || '--' }}
        </span>
      </el-table-column>
      <!-- 配置信息 -->
      <!-- <el-table-column
          
          :label="$t('minerList.configurationInformation')"
          align="center"
          width="100"
        >
          <span class="blueColor">
            {{ $t('farmList.clickView') }}
          </span>
        </el-table-column> -->
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
      <!-- 连接状态 -->
      <el-table-column :label="$t('userList.runStatus')" align="center">
        <span
          :class="[
            { greenColor: scope.row.runStatus === 'ONLINE' },
            { redColor: scope.row.runStatus === 'FAULT' },
            { orangeColor: scope.row.runStatus === 'WAIT' },
            { colorNine: scope.row.runStatus === 'DROP_LINE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`minerList.${scope.row.runStatus}`) }}
        </span>
      </el-table-column>
      <!-- 冻结状态 -->
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
      <!-- 状态 -->
      <el-table-column :label="$t('userList.state')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'FORZEN' },
            { redColor: scope.row.enableStatus === 'DISABLE' },
            { colorNine: scope.row.enableStatus === 'REMOVE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
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
            class="blueColor  cursor"
            @click="userMinerFrozenApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor cursor"
            @click="userMinerRelieveFrozenApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span v-else>
            --
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
    <graphicsCardList
      v-if="showTable === 'card' && showPopupDialog"
      :minerId="minerId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <flightDetails
      v-if="flightDialog && flightData"
      :popupDialog="flightDialog"
      :detailsData="flightData"
      @closePopup="closePopup"
    />
    <overclockDetails
      v-if="overclockDialog && overclockData"
      :popupDialog="overclockDialog"
      :detailsData="overclockData"
      @closePopup="closePopup"
    />
    <farmList
      v-if="showTable === 'farm' && showPopupDialog"
      :farmId="farmId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <userList
      v-if="showTable === 'user' && showPopupDialog"
      :userId="userIdPro"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { timeForStr, timeDifferenceFun } from '../../../utils';
import { tzTimeFormate } from '../../../filters';
import pagination from '../../../mixins/pagination';
import graphicsCardList from '../userList/table/graphicsCardList.vue';
import farmList from '../userList/table/farmList.vue';
import userList from '../userList/table/userList.vue';
import flightDetails from '../flightList/flightDetails.vue';
import overclockDetails from '../overclockList/overclockDetails.vue';
export default {
  name: 'MinerList',
  // 模板引入
  components: {
    graphicsCardList,
    flightDetails,
    overclockDetails,
    farmList,
    userList,
  },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      minerName: '',
      userId: '',
      runStatus: '',
      size: 20,
      page: 1,
      orderBy: '',
      orderType: '',
      stateOptions: [
        {
          value: 'NORMAL',
          label: this.$t('userList.NORMAL'),
        },
        {
          value: 'FORZEN',
          label: this.$t('userList.FORZEN'),
        },
        {
          value: 'REMOVE',
          label: this.$t('userList.REMOVE'),
        },
      ],
      suspendedStatusOptions: [
        {
          value: 'ONLINE',
          label: this.$t('minerList.ONLINE'),
        },
        {
          value: 'DROP_LINE',
          label: this.$t('minerList.DROP_LINE'),
        },
        {
          value: 'FAULT',
          label: this.$t('minerList.FAULT'),
        },
        {
          value: 'WAIT',
          label: this.$t('minerList.WAIT'),
        },
      ],
      useStatus: '',
      registrationTime: '',
      endRemove: '',
      totalsObj: null,
      tableData: [],
      userMinerPage: null,
      minerId: '',
      farmId: '',
      userIdPro: '',
      showTable: '',
      showPopupDialog: false,
      flightDialog: false,
      flightData: null,
      overclockDialog: false,
      overclockData: null,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.minerId = '';
      this.showTable = '';
      this.farmId = '';
      this.userIdPro = '';
      this.showPopupDialog = false;
      this.flightDialog = false;
      this.flightData = null;
      this.overclockDialog = false;
      this.overclockData = null;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.userFarmPageApi();
      }
    },
    showTableFun(row, name) {
      if (row && name) {
        this.minerId = row.id;
        this.userIdPro = row.userId;
        this.farmId = row.farmId;
        this.showTable = name;
        this.showPopupDialog = true;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      const { page } = this;
      if (page === 1) {
        this.userMinerPageApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userMinerPageApi(false);
    },
    async handleClick(data, name) {
      if (name === 'flight' && data.flightId) {
        const res = await this.$http.flightSheetBasePage({ id: data.flightId });
        if (res && res.records && res.records.length > 0) {
          this.flightDialog = true;
          this.flightData = res.records[0];
        } else {
          this.$message.warning(this.$t('public.noData'));
        }
      } else if (name === 'overclock' && data.templateId) {
        const res = await this.$http.templatePage({ id: data.templateId });
        if (res && res.records && res.records.length > 0) {
          this.overclockDialog = true;
          this.overclockData = res.records[0].templateGlobalDetail;
        } else {
          this.$message.warning(this.$t('public.noData'));
        }
      }
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
      this.userMinerPageApi();
    },
    timeDifferenceFun(time) {
      const { userMinerPage } = this;
      if (time && userMinerPage) {
        const { localDateTime } = userMinerPage;
        const _tiem = timeDifferenceFun(time, localDateTime);
        return _tiem;
      }
      return '--';
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
        minerName: this.minerName,
        userId: this.userId,
        useStatus: this.useStatus,
        orderBy: this.orderBy,
        orderType: this.orderType,
        runStatus: this.runStatus,
        startCreateTime,
        endCreateTime,
        startRemoveTime,
        endRemoveTime,
      };
    },
    async userMinerDataTotalApi(data) {
      const _data = Object.copyArrObj(data);
      delete _data.orderBy;
      delete _data.orderType;
      const res = await this.$http.userMinerDataTotal(_data);
      if (res) {
        this.totalsObj = res;
      }
    },
    async userMinerPageApi(isSearch = true) {
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
      const res = await this.$http.userMinerPage(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
      this.userMinerDataTotalApi(search);
    },
    async userMinerFrozenApi(data) {
      const res = await this.$http.userMinerFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.FORZENSUC').replace(/{name}/, data.minerName)
        );
        this.userMinerPageApi();
      }
    },
    async userMinerRelieveFrozenApi(data) {
      const res = await this.$http.userMinerRelieveFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.unblockSuc').replace(/{name}/, data.minerName)
        );
        this.userMinerPageApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userMinerPageApi();
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
.miner-list-totals-list {
  :first-child {
    margin-right: 5px;
  }
}
.overflow {
  min-width: max-content;
}
</style>
