<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || minerId
      )}${$t('graphicsCardList.graphicsCardList')}`
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
      <!-- 型号 -->
      <el-table-column :label="$t('graphicsCardList.model')" align="center">
        <span slot-scope="scope">{{ scope.row.graphicsCardName || '--' }}</span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column
        :label="$t('minerList.farmId')"
        align="center"
        width="70"
      >
        <span slot-scope="scope" >
          {{ scope.row.farmId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属矿机 -->
      <el-table-column
        :label="$t('graphicsCardList.ownedMiningMachine')"
        align="center"
        width="70"
      >
        <span slot-scope="scope" >
          {{ scope.row.minerId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属用户 -->
      <el-table-column
        :label="$t('farmList.owningUser')"
        align="center"
        width="70"
      >
        <span slot-scope="scope" >
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 驱动版本 -->
      <el-table-column
        :label="$t('graphicsCardList.driverVersion')"
        align="center"
        width="100"
      >
        <span slot-scope="scope" >
          {{ scope.row.driveVersion || '--' }}
        </span>
      </el-table-column>
      <!-- OEM -->
      <!-- <el-table-column
        :label="$t('graphicsCardList.driverVersion')"
        align="center"
        width="70"
      >
        <span slot-scope="scope" >
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
        <span  slot-scope="scope">
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
        <span  slot-scope="scope">
          {{ scope.row.templateId || '--' }}
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
      <!-- <el-table-column
        :label="$t('userList.operate')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <span
            class="blueColor  cursor"
            @click="userCardFrozenApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor cursor"
            @click="userCardRelieveFrozenApi(scope.row)"
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
import pagination from '../../../../mixins/pagination';
export default {
  name: 'UserGraphicsCardList',
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
    minerId: {
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
      const { size, userId, farmId, minerId } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        farmId,
        minerId,
        size,
        page: _page,
      };
      const res = await this.$http.userCardPage(data);
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
