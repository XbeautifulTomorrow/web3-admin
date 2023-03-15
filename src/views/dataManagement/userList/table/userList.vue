<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(/{uid}/, userId)}${$t(
        'userList.userList'
      )}`
    "
    :visible.sync="popupDialog"
    width="1300px"
    :before-close="closePopup"
    class="public-dialog public-dialog-table"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- UID/用户名 -->
      <el-table-column
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
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.farmNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 总矿机 -->
      <el-table-column
        prop="minerNumber"
        :label="$t('userList.totalMiner')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.minerNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 在线矿机 -->
      <el-table-column
        prop="onlineMinerNumber"
        :label="$t('userList.minerOnline')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.onlineMinerNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 显卡 -->
      <el-table-column
        prop="cardNumber"
        :label="$t('userList.graphicsCard')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.cardNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 总算力 -->
      <el-table-column
        prop="powers"
        :label="$t('userList.totalComputingPower')"
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
        <span slot-scope="scope">
          {{ scope.row.walletNumber || '' }}
        </span>
      </el-table-column>
      <!-- 白名单 -->
      <!-- <el-table-column
        
        :label="$t('userList.whitelist')"
        align="center"
      >
        <span class="blueColor" slot-scope="scope">
          {{ scope.row.money || '--' }}
        </span>
      </el-table-column>
      余额
      <el-table-column
        
        :label="$t('userList.balance')"
        
        align="center"
      >
        <span class="blueColor" slot-scope="scope">
          {{ scope.row.number || '--' }}
        </span>
      </el-table-column>
      单日支出
      <el-table-column
        
        :label="$t('userList.dailySpending')"
        
        align="center"
        width="100"
      >
        <span class="blueColor" slot-scope="scope">
          {{ scope.row.number || '--' }}
        </span>
      </el-table-column>
      总支出
      <el-table-column
        
        :label="$t('userList.totalExpenses')"
        
        align="center"
        width="90"
      >
        <span class="blueColor" slot-scope="scope">
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
      <!-- <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="100"
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
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      v-if="tablePopupPage && tablePopupPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="tablePopupPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
    </div>
  </el-dialog>
</template>
<script>
import pagination from '../../../../mixins/pagination';
import { tzTimeFormate } from '../../../../filters';
export default {
  name: 'UserUserList',
  mixins: [pagination],
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      size: 20,
      page: 1,
      tableData: [],
      tablePopupPage: null,
    };
  },
  methods: {
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    handleSizeChange(val) {
      this.size = val;
      this.userPopupPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userPopupPageApi(false);
    },
    async userPopupPageApi(isSearch = true) {
      const { size, userId } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        id: userId,
        size,
        page: _page,
      };
      const res = await this.$http.baseUserPage(data);
      if (res) {
        this.tablePopupPage = res;
        this.tableData = res.records;
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userPopupPageApi();
  },
};
</script>
