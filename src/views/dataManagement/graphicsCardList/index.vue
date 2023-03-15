<template>
  <div class="miner-list public-css">
    <div class="public-list-inputs">
      <!-- 输入ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
        v-model.number="id"
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
      <!-- 输入矿机ID -->
      <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('minerList.minerId')}`"
        v-model.number="minerId"
        clearable
      />
      <!-- 用户Id -->
      <!-- <el-input
        class="public-input"
        type="number"
        :placeholder="`${$t('public.write')}${$t('farmList.userID')}`"
        v-model.number="userId"
        clearable
      /> -->
      <!-- 输入显卡型号 -->
      <el-input
        class="public-input"
        :placeholder="
          `${$t('public.write')}${$t('graphicsCardList.graphicsCardModel')}`
        "
        v-model="graphicsCardName"
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
      <el-select
        v-model="runStatus"
        class="public-select-box"
        popper-class="public-select-box"
        :placeholder="`${$t('public.select')}${$t('userList.currentState')}`"
        clearable
      >
        <el-option
          v-for="item in runStatusOptions"
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
        @click="userCardPageApi"
      >
        {{ $t('public.search') }}
      </el-button>
    </div>
    <ul class="miner-list-totals public-totals" v-if="userCardPage">
      <li class="miner-list-totals-list public-totals-list">
        <span>{{ $t('userList.totalGraphicsCard') }}:</span>
        <span class="greenColor">{{ userCardPage.total || '--' }}</span>
      </li>
    </ul>
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
      <!-- 型号 -->
      <el-table-column
        :label="$t('graphicsCardList.graphicsCardModel')"
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.graphicsCardName || '--' }}</span>
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
      <!-- 所属矿机 -->
      <el-table-column
        :label="$t('graphicsCardList.ownedMiningMachine')"
        align="center"
        width="70"
      >
        <span slot-scope="scope">
          {{ scope.row.minerId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属用户 -->
      <el-table-column
        :label="$t('farmList.owningUser')"
        align="center"
        width="70"
      >
        <span slot-scope="scope">
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 驱动版本 -->
      <el-table-column
        :label="$t('graphicsCardList.driverVersion')"
        align="center"
        width="100"
      >
        <span slot-scope="scope">
          {{ scope.row.driveVersion || '--' }}
        </span>
      </el-table-column>
      <!-- OEM -->
      <!-- <el-table-column
        :label="$t('graphicsCardList.driverVersion')"
        align="center"
        width="70"
      >
        <span slot-scope="scope" class="blueColor">
          {{ scope.row.farmId || '--' }}
        </span>
      </el-table-column> -->
      <!-- 显存大小 -->
      <el-table-column
        :label="$t('graphicsCardList.graphicsCardMemory')"
        align="center"
        width="70"
      >
        <span slot-scope="scope">
          {{ scope.row.graphicsCardMemory || '--' }}
        </span>
      </el-table-column>
      <!-- 显存型号 -->
      <el-table-column
        :label="$t('graphicsCardList.graphicsMemoryName')"
        align="center"
        width="70"
      >
        <span slot-scope="scope">
          {{ scope.row.graphicsMemoryName || '--' }}
        </span>
      </el-table-column>
      <!-- VBIOS -->
      <el-table-column
        :label="$t('graphicsCardList.vbios')"
        align="center"
        width="130"
      >
        <span slot-scope="scope">
          {{ scope.row.vbios || '--' }}
        </span>
      </el-table-column>
      <!-- 启动器 -->
      <el-table-column
        prop="flightId"
        :label="$t('minerList.launcher')"
        align="center"
        width="80"
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
        align="center"
        width="80"
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
      <el-table-column
        :label="$t('userList.currentState')"
        align="center"
        width="70"
      >
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
      <el-table-column
        :label="$t('farmList.frozenState')"
        align="center"
        width="70"
      >
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
      <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="userCardFrozenApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="userCardRelieveFrozenApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span v-else class="publick-button">
            --
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userCardPage && userCardPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userCardPage.total"
      class="public-pagination"
    >
    </el-pagination>
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
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import pagination from '../../../mixins/pagination';
import flightDetails from '../flightList/flightDetails.vue';
import overclockDetails from '../overclockList/overclockDetails.vue';
export default {
  name: 'GraphicsCardList',
  // 模板引入
  components: { flightDetails, overclockDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      minerId: '',
      graphicsCardName: '',
      userId: '',
      farmId: '',
      useStatus: '',
      runStatus: '',
      size: 20,
      page: 1,
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
      runStatusOptions: [
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

      totalsObj: null,
      tableData: [],
      userCardPage: null,
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
      this.flightDialog = false;
      this.flightData = null;
      this.overclockDialog = false;
      this.overclockData = null;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.userCardPageApi();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      const { page } = this;
      this.userCardPageApi();
      if (page === 1) {
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userCardPageApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      return {
        id: this.id,
        minerId: this.minerId,
        graphicsCardName: this.graphicsCardName,
        userId: this.userId,
        farmId: this.farmId,
        useStatus: this.useStatus,
        runStatus: this.runStatus,
      };
    },
    async userCardPageApi(isSearch = true) {
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
      const res = await this.$http.userCardPage(data);
      if (res) {
        this.userCardPage = res;
        this.tableData = res.records;
      }
    },
    async userCardFrozenApi(data) {
      const res = await this.$http.userMinerFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.FORZENSUC').replace(/{name}/, data.graphicsCardName)
        );
        this.userCardPageApi();
      }
    },
    async userCardRelieveFrozenApi(data) {
      const res = await this.$http.userMinerRelieveFrozen({
        id: data.id,
      });
      if (res) {
        this.$message.success(
          this.$t('userList.unblockSuc').replace(
            /{name}/,
            data.graphicsCardName
          )
        );
        this.userCardPageApi();
      }
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
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.userCardPageApi();
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
</style>
