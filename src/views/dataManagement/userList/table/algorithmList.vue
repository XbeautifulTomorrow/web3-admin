<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || coin
      )}${$t('algorithm.algorithmList')}`
    "
    :visible.sync="popupDialog"
    width="1300px"
    :before-close="closePopup"
    class="public-dialog public-dialog-table"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column :label="$t('farmList.id')" align="center">
        <span slot-scope="scope">{{ scope.row.id || '--' }}</span>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.algorithmName || '--' }}</span>
      </el-table-column>
      <!-- 相关币种 -->
      <el-table-column :label="$t('algorithm.coins')" align="center">
        <template
          slot-scope="scope"
          v-if="scope.row.coins && scope.row.coins.length > 0"
        >
          <span
            v-for="(item, index) in scope.row.coins"
            :key="`coins-${index}`"
            
          >
            {{ item.coinName }}
          </span>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 超频模板 -->
      <el-table-column
        :label="$t('minerList.overclockingTemplate')"
        align="center"
      >
        <span  slot-scope="scope">
          {{ scope.row.templateNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 超频预设 -->
      <!-- <el-table-column
        :label="$t('algorithm.overclockingPresets')"
        align="center"
      >
        <span
          slot-scope="scope"
          class="blueColor cursor"
          @click="overclockDetailsDialogFun(scope.row)"
        >
          {{ $t('public.checkDetails') }}
        </span>
      </el-table-column> -->
      <!-- 当前状态 -->
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
      <!-- <el-table-column :label="$t('userList.operate')" align="center">
        <template slot-scope="scope">
          <span class="blueColor cursor" @click="showPopup(scope.row)">
            {{ $t('currency.edit') }}
          </span>
          <span
            class="blueColor  cursor"
            @click="algorithmBaseUpdateApi(scope.row)"
            v-if="scope.row.useStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor cursor"
            @click="algorithmBaseUpdateApi(scope.row)"
            v-else-if="scope.row.useStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span v-else>
            --
          </span>
          <span
            class="blueColor cursor"
            @click="algorithmBaseDeleteApi(scope.row)"
            >{{ $t('currency.delete') }}</span
          >
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
  name: 'UserAlgorithmList',
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
    coin: {
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
    async userPopupPageApi(isSearch = true) {
      const { size, userId, farmId, coin } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        farmId,
        coin,
        size,
        page: _page,
      };
      const res = await this.$http.algorithmBasePageList(data);
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
