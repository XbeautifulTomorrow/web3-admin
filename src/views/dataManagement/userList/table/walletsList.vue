<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || coinId
      )}${$t('wallet.walletsList')}`
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
      <el-table-column :label="$t('farmList.name')" align="center" width="320">
        <span slot-scope="scope">{{ scope.row.walletName || '--' }}</span>
      </el-table-column>
      <!-- 所属用户ID -->
      <el-table-column
        prop="userId"
        :label="$t('farmList.owningUserID')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.userId || '--' }}
        </span>
      </el-table-column>
      <!-- 所属矿场 -->
      <el-table-column
        prop="farmId"
        :label="$t('minerList.farmId')"
        align="center"
      >
        <span v-if="scope.row.farmId" slot-scope="scope">
          {{ scope.row.farmId }}
        </span>
        <span v-else>
          {{ $t('wallet.global') }}
        </span>
      </el-table-column>
      <!-- 币种 -->
      <el-table-column
        prop="coinName"
        :label="$t('currency.currency')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.coinName || '--' }}
        </span>
      </el-table-column>
      <!-- 地址 -->
      <el-table-column
        prop="walletAddress"
        :label="$t('wallet.walletAddress')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.walletAddress || '--' }}
        </span>
      </el-table-column>
      <!-- 关联启动器 -->
      <el-table-column
        prop="flightNumber"
        :label="$t('wallet.flightNumber')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.flightNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column
        prop="strikeOut"
        :label="$t('userList.state')"
        align="center"
      >
        <span
          slot-scope="scope"
          :class="[
            { greenColor: scope.row.strikeOut === 0 },
            { redColor: scope.row.strikeOut === 1 },
          ]"
        >
          {{
            scope.row.strikeOut ? $t('userList.REMOVE') : $t('userList.NORMAL')
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
  name: 'UserWalletsList',
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
      const { size, userId, farmId, coinId } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        farmId,
        coinId,
        size,
        page: _page,
      };
      const res = await this.$http.userWalletPageList(data);
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
