<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || coinId
      )}${$t('orePool.orePoolList')}`
    "
    :visible.sync="popupDialog"
    width="1300px"
    :before-close="closePopup"
    class="public-dialog public-dialog-table"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.poolName || '--' }}</span>
      </el-table-column>
      <!-- 支持币种 -->
      <el-table-column :label="$t('algorithm.coinIds')" align="center">
        <template
          slot-scope="scope"
          v-if="scope.row.coins && scope.row.coins.length > 0"
        >
          <p
            class="coin-list"
            v-for="(item, index) in scope.row.coins"
            :key="`coins-${index}`"
          >
            <img :src="item.coinImage" alt="" class="icon" />
            <span>{{ item.coinName }}</span>
          </p>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 相关URL -->
      <el-table-column
        :label="$t('orePool.orePoolServers')"
        align="center"
        width="200"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.orePoolServers && scope.row.orePoolServers.length > 0"
        >
          <p
            v-for="(item, index) in scope.row.orePoolServers"
            :key="`orePoolServers-${index}`"
          >
            <span>[{{ item.serverName }}]</span>
            <span>{{ item.serverUrl }}</span>
          </p>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 启动器 -->
      <el-table-column :label="$t('minerList.launcher')" align="center">
        <span slot-scope="scope">
          {{ scope.row.flightNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('userList.currentState')" align="center">
        <span
          :class="[
            { greenColor: scope.row.enableStatus === 'NORMAL' },
            { redColor: scope.row.enableStatus === 'DISABLE' },
          ]"
          slot-scope="scope"
        >
          {{ $t(`userList.${scope.row.enableStatus}`) }}
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
            @click="orePoolProhibitApi(scope.row)"
            v-if="scope.row.enableStatus === 'NORMAL'"
          >
            {{ $t('userList.DISABLE') }}
          </span>
          <span
            class="blueColor cursor"
            @click="orePoolEnableApi(scope.row)"
            v-else-if="scope.row.enableStatus === 'DISABLE'"
          >
            {{ $t('userList.ENABLE') }}
          </span>
          <span v-else>
            --
          </span>
          <span class="blueColor cursor" @click="orePoolDeleteApi(scope.row)">
            {{ $t('currency.delete') }}
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
  name: 'UserPoolList',
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
      const { size, userId, farmId, coinId, coinName } = this;
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
      const res = await this.$http.orePoolPageList(data);
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
<style lang="scss" scoped>
.icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 3px;
}
</style>
