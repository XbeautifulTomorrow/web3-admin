<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(/{uid}/, walletId)}${$t(
        'minerList.minerList'
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
    <flightDetails
      v-if="detailsDialog && detailsData"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closeDetailsPopup"
    />
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
    </div>
  </el-dialog>
</template>
<script>
import { timeDifferenceFun } from '../../../../utils';
import pagination from '../../../../mixins/pagination';
import flightDetails from '../../../dataManagement/flightList/flightDetails.vue';
export default {
  name: 'UserFlightList',
  mixins: [pagination],
  components: { flightDetails },
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    walletId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      size: 20,
      page: 1,
      tableData: [],
      detailsDialog: false,
      detailsData: null,
      tablePopupPage: null,
    };
  },
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
      this.closeDetailsPopup();
    },
    closeDetailsPopup() {
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
      this.userPopupPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.userPopupPageApi(false);
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
      const { size, walletId } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        walletId,
        size,
        page: _page,
      };
      const res = await this.$http.flightSheetBasePage(data);
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
