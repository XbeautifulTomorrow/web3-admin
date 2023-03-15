<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || coinId || templateId
      )}${$t('minerList.minerList')}`
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
        <span slot-scope="scope">
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
        <span slot-scope="scope">
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
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.powers || '--' }}
        </span>
      </el-table-column>
      <!-- 核心温度 -->
      <el-table-column
        prop="cpuTemperature"
        :label="$t('minerList.coreTemperature')"
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
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.flightId || '--' }}
        </span>
      </el-table-column>
      <!-- 超频模板 -->
      <el-table-column
        prop="overclockingTemplate"
        :label="$t('minerList.overclockingTemplate')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
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
          <p>{{ timeDifferenceFun(scope.row.minerStartTime) }}</p>
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
        <span slot-scope="scope">
          {{ scope.row.systemVersion || '--' }}
        </span>
      </el-table-column>
      <!-- 配置信息 -->
      <!-- <el-table-column
          
          :label="$t('minerList.configurationInformation')"
          align="center"
          width="100"
        >
          <span >
            {{ $t('farmList.clickView') }}
          </span>
        </el-table-column> -->
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
      <!-- 操作 -->
      <!-- <el-table-column
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
import { timeDifferenceFun } from '../../../../utils';
import { tzTimeFormate } from '../../../../filters';
import pagination from '../../../../mixins/pagination';
export default {
  name: 'UserMinerList',
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
    coinId: {
      type: [Number, String],
      default: '',
    },
    templateId: {
      type: [Number, String],
      default: '',
    },
    runStatus: {
      type: String,
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
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    timeDifferenceFun(time) {
      const { tablePopupPage } = this;
      if (time && tablePopupPage) {
        const { localDateTime } = tablePopupPage;
        const _tiem = timeDifferenceFun(time, localDateTime);
        return _tiem;
      }
      return '--';
    },
    async userPopupPageApi(isSearch = true) {
      const { size, userId, farmId, coinId, templateId, runStatus } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        farmId,
        coinId,
        templateId,
        runStatus,
        size,
        page: _page,
      };
      const res = await this.$http.userMinerPage(data);
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
