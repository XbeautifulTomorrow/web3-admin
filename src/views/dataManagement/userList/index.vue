<template>
  <div class="user-list public-css">
    <div class="public-list-inputs">
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('userList.UID')}`"
        v-model.number="id"
        clearable
      />
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('userList.userName')}`"
        v-model="userName"
        clearable
      />
      <el-input
        class="public-input"
        :placeholder="`${$t('public.write')}${$t('userList.email')}`"
        v-model="email"
        clearable
      />
      <!-- @change="changeLanguage" -->
      <!-- disabled -->
      <el-select
        v-model="userStatus"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('userList.state')}`"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="public-date-box">
        <span class="demonstration">
          {{ $t('userList.registrationTime') }}:
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
      <div class="public-date-box">
        <span class="demonstration">{{ $t('userList.lastLoginTime') }}:</span>
        <el-date-picker
          v-model="loginedTime"
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
        @click="baseUserPageApi"
      >
        {{ $t('public.search') }}
      </el-button>
      <!-- <el-button
        type="success"
        class="public-search"
        @click="openPopupFun('addDialog')"
      >
        {{ $t('userList.addPlayer') }}
      </el-button> -->
    </div>
    <ul class="user-list-totals public-totals" v-if="totalsObj">
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalUsers') }}:</span>
        <span class="greenColor">{{ totalsObj.userNumber || '--' }}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMine') }}:</span>
        <span class="greenColor">{{ totalsObj.farmNumber || '--' }}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMiner') }}:</span>
        <span class="greenColor">{{ totalsObj.minerNumber || '--' }}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalMinerOnline') }}:</span>
        <span class="greenColor">
          {{ totalsObj.onlineMinerNumber || '--' }}
        </span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalGraphicsCard') }}:</span>
        <span class="greenColor">{{ totalsObj.cardNumber || '--' }}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalComputingPower') }}:</span>
        <span class="greenColor">
          {{ Object.formatHashSize(totalsObj.powers, 1).number }}
          {{ Object.formatHashSize(totalsObj.powers, 1).digit }}
        </span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalWallet') }}:</span>
        <span class="greenColor">{{ totalsObj.walletNumber || '--' }}</span>
      </li>
      <!-- <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalBalance') }}:</span>
        <span class="greenColor">{{ totalsObj.farmNumber ||'--'}}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalDailySpend') }}:</span>
        <span class="greenColor">{{ totalsObj.farmNumber ||'--'}}</span>
      </li>
      <li class="user-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalExpenses') }}:</span>
        <span class="greenColor">{{ totalsObj.farmNumber ||'--'}}</span>
      </li> -->
    </ul>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="public-table"
      border
      @sort-change="sortChange"
    >
      <!-- UID/用户名 -->
      <el-table-column
        sortable="custom"
        prop="id"
        :label="$t('userList.uidUserName')"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.id || '--' }}</p>
          <p>{{ scope.row.userName || '--' }}</p>
        </template>
      </el-table-column>
      <!-- 邮箱 -->
      <el-table-column :label="$t('userList.email')" align="center" width="150">
        <span slot-scope="scope">{{ scope.row.email || '--' }}</span>
      </el-table-column>
      <!-- 矿场 -->
      <el-table-column
        prop="farmNumber"
        :label="$t('userList.farm')"
        sortable="custom"
        align="center"
      >
        <span
          :class="[
            {
              'blueColor cursor': scope.row.farmNumber,
            },
          ]"
          slot-scope="scope"
          @click="scope.row.farmNumber ? showTableFun(scope.row, 'farm') : ''"
        >
          {{ scope.row.farmNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 总矿机 -->
      <el-table-column
        prop="minerNumber"
        :label="$t('userList.totalMiner')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span
          :class="[
            {
              'blueColor cursor': scope.row.minerNumber,
            },
          ]"
          slot-scope="scope"
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
          :class="[
            {
              'blueColor cursor': scope.row.onlineMinerNumber,
            },
          ]"
          slot-scope="scope"
          @click="
            scope.row.onlineMinerNumber ? showTableFun(scope.row, 'miner') : ''
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
          :class="[
            {
              'blueColor cursor': scope.row.cardNumber,
            },
          ]"
          slot-scope="scope"
          @click="scope.row.cardNumber ? showTableFun(scope.row, 'card') : ''"
        >
          {{ scope.row.cardNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 总算力 -->
      <el-table-column
        prop="powers"
        :label="$t('userList.totalComputingPower')"
        sortable="custom"
        align="center"
        width="90"
      >
        <span slot-scope="scope">
          {{ Object.formatHashSize(scope.row.powers, 1).number }}
          {{ Object.formatHashSize(scope.row.powers, 1).digit }}
        </span>
      </el-table-column>
      <!-- 钱包 -->
      <el-table-column
        prop="walletNumber"
        :label="$t('userList.wallet')"
        align="center"
      >
        <span
          :class="[
            {
              'blueColor cursor':
                scope.row.walletNumber && scope.row.walletNumber > 0,
            },
          ]"
          slot-scope="scope"
          @click="
            scope.row.walletNumber && scope.row.walletNumber > 0
              ? showTableFun(scope.row, 'wallets')
              : ''
          "
        >
          {{ scope.row.walletNumber || '' }}
        </span>
      </el-table-column>
      <!-- 白名单 -->
      <!-- <el-table-column
        
        :label="$t('userList.whitelist')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.money || '--' }}
        </span>
      </el-table-column>
      余额
      <el-table-column
        
        :label="$t('userList.balance')"
        sortable="custom"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.number || '--' }}
        </span>
      </el-table-column>
      单日支出
      <el-table-column
        
        :label="$t('userList.dailySpending')"
        sortable="custom"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.number || '--' }}
        </span>
      </el-table-column>
      总支出
      <el-table-column
        
        :label="$t('userList.totalExpenses')"
        sortable="custom"
        align="center"
        width="90"
      >
        <span slot-scope="scope">
          {{ scope.row.number || '--' }}
        </span>
      </el-table-column> -->
      <!-- 注册时间 -->
      <el-table-column
        :label="$t('userList.registrationTime')"
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
      <!-- 最后登录时间 -->
      <el-table-column
        :label="$t('userList.lastLoginTime')"
        prop="loginTime"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <p>{{ timeFormateFun(scope.row.loginTime).date }}</p>
          <p v-if="scope.row.loginTime">
            {{ timeFormateFun(scope.row.loginTime).time }}
          </p>
        </template>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('userList.currentState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.userStatus === 'NORMAL' },
            { redColor: scope.row.userStatus === 'FORZEN' },
            { colorNine: scope.row.userStatus === 'REMOVE' },
            { redColor: scope.row.userStatus === 'DISABLE' },
          ]"
          slot-scope="scope"
        >
          {{
            $t(
              `userList.${
                scope.row.userStatus === 'DISABLE'
                  ? 'DISABLENOTREG'
                  : scope.row.userStatus
              }`
            )
          }}
        </span>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="openPopupFun('detailsDialog', scope.row)"
          >
            {{ $t('userList.details') }}
          </span>
          <span
            class="blueColor publick-button  cursor"
            @click="openPopupFun('suspensionDialog', scope.row)"
            v-if="scope.row.userStatus === 'NORMAL'"
          >
            {{ $t('userList.freeze') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="openPopupFun('unblockDialog', scope.row)"
            v-else-if="scope.row.userStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="changePaw(scope.row)"
            >修改密码</span
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="baseUserPage && baseUserPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="baseUserPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <userDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <userSuspension
      v-if="suspensionDialog"
      :popupDialog="suspensionDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <userUnblock
      v-if="unblockDialog"
      :popupDialog="unblockDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <userAdd
      v-if="addDialog"
      :popupDialog="addDialog"
      @closePopup="closePopup"
    />
    <userChangePaw
      v-if="changePawDialog"
      :popupDialog="changePawDialog"
      :userData="userData"
      @closePopup="closePopup"
    />
    <farmList
      v-if="showTable === 'farm' && showPopupDialog"
      :userId="userId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <minerList
      v-if="showTable === 'miner' && showPopupDialog"
      :userId="userId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <graphicsCardList
      v-if="showTable === 'card' && showPopupDialog"
      :userId="userId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
    <walletsList
      v-if="showTable === 'wallets' && showPopupDialog"
      :userId="userId"
      :popupDialog="showPopupDialog"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import userDetails from './userDetails.vue';
import userSuspension from './userSuspension.vue';
import userUnblock from './userUnblock.vue';
import userAdd from './userAdd.vue';
import { timeForStr } from '../../../utils';
import { tzTimeFormate } from '../../../filters';
import pagination from '../../../mixins/pagination';
import farmList from './table/farmList.vue';
import minerList from './table/minerList.vue';
import graphicsCardList from './table/graphicsCardList.vue';
import walletsList from './table/walletsList.vue';
import userChangePaw from './userChangePaw.vue';
export default {
  name: 'UserList',
  // 模板引入
  components: {
    userAdd,
    userDetails,
    userSuspension,
    userUnblock,
    farmList,
    minerList,
    graphicsCardList,
    walletsList,
    userChangePaw,
  },
  mixins: [pagination],
  // 数据
  data() {
    return {
      userId: '',
      showTable: '',
      showPopupDialog: false,
      id: '', // 用户UID
      userName: '', // 用户名
      email: '', // 邮箱
      size: 20,
      page: 1,
      orderBy: '', // 排序字段
      orderType: '', // 升降序
      addDialog: false, // 添加玩家弹窗
      detailsDialog: false, // 详情弹窗
      suspensionDialog: false, // 冻结弹窗
      unblockDialog: false, // 解封弹窗
      detailsData: null, // 详情信息
      changePawDialog: false, // 修改密码
      userData: undefined, // 修改密码的用户名
      options: [
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
        {
          value: 'DISABLE',
          label: this.$t('userList.DISABLENOTREG'),
        },
      ],
      userStatus: '', // 状态
      registrationTime: '', // 注册时间
      loginedTime: '', // 登录时间
      totalsObj: null,
      tableData: [],
      baseUserPage: null,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.detailsDialog = false;
      this.suspensionDialog = false;
      this.unblockDialog = false;
      this.addDialog = false;
      this.changePawDialog = false;
      this.detailsData = '';
      this.userId = '';
      this.showTable = '';
      this.userData = undefined;
      this.showPopupDialog = false;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.baseUserPageApi();
      }
    },
    changePaw(row) {
      this.changePawDialog = true;
      this.userData = row;
    },
    openPopupFun(name, data) {
      this[name] = true;
      if (data) {
        this.detailsData = data;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.baseUserPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.baseUserPageApi(false);
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
      this.baseUserPageApi();
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    showTableFun(row, name) {
      if (row && name) {
        this.userId = row.id;
        this.showTable = name;
        this.showPopupDialog = true;
      }
    },
    searchFun() {
      let { registrationTime, loginedTime } = this;
      let startRegTime = '';
      let endRegTime = '';
      let startLoginTime = '';
      let endLoginTime = '';
      if (registrationTime && registrationTime[0]) {
        startRegTime = timeForStr(registrationTime[0], 'YYYY-MM-DD');
      }
      if (registrationTime && registrationTime[1]) {
        endRegTime = timeForStr(registrationTime[1], 'YYYY-MM-DD');
      }
      if (loginedTime && loginedTime[0]) {
        startLoginTime = timeForStr(loginedTime[0], 'YYYY-MM-DD');
      }
      if (loginedTime && loginedTime[1]) {
        endLoginTime = timeForStr(loginedTime[1], 'YYYY-MM-DD');
      }
      return {
        id: this.id,
        userName: this.userName,
        email: this.email,
        userStatus: this.userStatus,
        orderBy: this.orderBy,
        orderType: this.orderType,
        startRegTime,
        endRegTime,
        startLoginTime,
        endLoginTime,
      };
    },
    async baseUserDataTotalApi(data) {
      const res = await this.$http.baseUserDataTotal(data);
      if (res) {
        this.totalsObj = res;
      }
    },
    async baseUserPageApi(isSearch = true) {
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
      const res = await this.$http.baseUserPage(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }
      this.baseUserDataTotalApi(search);
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.baseUserPageApi();
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
.user-list-totals-list {
  :first-child {
    margin-right: 5px;
  }
}
</style>
