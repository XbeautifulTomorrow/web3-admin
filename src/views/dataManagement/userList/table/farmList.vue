<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(/{uid}/, userId || farmId)}${$t(
        'farmList.farmList'
      )}`
    "
    :visible.sync="popupDialog"
    width="1300px"
    :before-close="closePopup"
    class="public-dialog public-dialog-table"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column
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
        align="center"
        width="90"
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
      <!-- 当前算力 -->
      <el-table-column
        prop="powers"
        :label="$t('farmList.currentHashrate')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.powers || '--' }}
        </span>
      </el-table-column>
      <!-- 余额
      <el-table-column
        :label="$t('userList.balance')"
        
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.number || '--' }}</span>
      </el-table-column>

      单日支出
      <el-table-column
        :label="$t('userList.dailySpending')"
        
        align="center"
        width="100"
      >
        <span slot-scope="scope">{{ scope.row.number || '--' }}</span>
      </el-table-column>
      总支出
      <el-table-column
        :label="$t('userList.totalExpenses')"
        
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
        <span >
          {{ $t('farmList.clickView') }}
        </span>
      </el-table-column> -->
      <!-- 当前状态 -->
      <el-table-column :label="$t('userList.currentState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'FORZEN' },
            { colorNine: scope.row.enableStatus === 'REMOVE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
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
      <!-- 操作 -->
      <!-- <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <span
            class="blueColor  cursor"
            @click="userFarmFrozenApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor cursor"
            @click="userFarmRelieveFrozenApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
        </template>
      </el-table-column> -->
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
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
    </div>
  </el-dialog>
</template>
<script>
import { tzTimeFormate } from '../../../../filters';
import pagination from '../../../../mixins/pagination';
export default {
  name: 'UserFarmList',
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
    farmId: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      size: 20,
      page: 1,
      tableData: [],
      userFarmPage: null,
    };
  },
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    handleSizeChange(val) {
      this.size = val;
      this.userFarmPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userFarmPageApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    async userFarmPageApi(isSearch = true) {
      const { size, userId, farmId } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        id: farmId,
        size,
        page: _page,
      };
      const res = await this.$http.userFarmPage(data);
      if (res) {
        this.userFarmPage = res;
        this.tableData = res.records;
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userFarmPageApi();
  },
};
</script>
