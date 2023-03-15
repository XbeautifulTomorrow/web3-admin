<template>
  <el-dialog
    :title="
      `${$t('userList.uidList').replace(
        /{uid}/,
        userId || farmId || coinName
      )}${$t('miningSoftware.miningSoftwareList')}`
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
      <el-table-column :label="$t('miningSoftware.nameOther')" align="center">
        <span slot-scope="scope">{{ scope.row.name || '--' }}</span>
      </el-table-column>
      <!-- 支持币种 -->
      <el-table-column
        :label="$t('miningSoftware.softwareCoins')"
        align="center"
        width="100"
      >
        <el-popover
          v-if="
            scope.row.softwareCoinVOS && scope.row.softwareCoinVOS.length > 0
          "
          placement="bottom"
          :title="$t('miningSoftware.softwareCoins')"
          width="200"
          trigger="click"
          slot-scope="scope"
        >
          <span slot="reference" class="blueColor cursor">
            {{ $t('public.check') }}
          </span>
          <p
            class="softwareCoinVOS-list"
            v-for="(item, index) in scope.row.softwareCoinVOS"
            :key="`softwareCoinVOS-${index}`"
          >
            <template v-if="item.coinConfigVO">
              <img class="icon" :src="item.coinConfigVO.coinImage" alt="" />
              <span>{{ item.coinConfigVO.coinName }}</span>
            </template>
            <span v-else>--</span>
          </p>
        </el-popover>
        <span v-else>--</span>
      </el-table-column>
      <!-- 支持显卡 -->
      <el-table-column
        :label="$t('miningSoftware.graphicsCard')"
        align="center"
      >
        <span slot-scope="scope">{{ scope.row.graphicsCard || '--' }}</span>
      </el-table-column>
      <!-- 是否有强度 -->
      <!-- 版本链接 -->
      <el-table-column
        :label="$t('miningSoftware.softwareVersionVOS')"
        align="center"
      >
        <template
          slot-scope="scope"
          v-if="
            scope.row.softwareVersionVOS &&
              scope.row.softwareVersionVOS.length > 0
          "
        >
          <p
            v-for="(item, index) in scope.row.softwareVersionVOS"
            :key="`softwareVersionVOS-${index}`"
          >
            <span class="blueColor">{{ item.version }}</span>
            <span class="blueColor" v-if="item.downloadPath">
              ,{{ item.downloadPath }}
            </span>
          </p>
        </template>
        <span v-else>--</span>
      </el-table-column>
      <!-- 当前状态 -->
      <el-table-column :label="$t('farmList.frozenState')" align="center">
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
      <!-- 操作 -->
      <!-- <el-table-column :label="$t('userList.operate')" align="center">
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="showPopup(scope.row)"
          >
            {{ $t('currency.edit') }}
          </span>
          <span
            class="blueColor publick-button  cursor"
            @click="miningSoftwareEnableStatusApi(scope.row)"
            v-if="scope.row.enableStatus === 'NORMAL'"
          >
            {{ $t('userList.ban') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="miningSoftwareEnableStatusApi(scope.row)"
            v-else-if="scope.row.enableStatus === 'FORZEN'"
          >
            {{ $t('userList.unblock') }}
          </span>
          <span v-else class="publick-button">
            --
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="miningSoftwareDeleteApi(scope.row)"
          >
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
  name: 'userMiningSoftwareList',
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
    coinName: {
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
      const { size, userId, farmId, coinId, coinName } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        userId,
        farmId,
        coinName,
        size,
        page: _page,
      };
      const res = await this.$http.miningSoftwarePageList(data);
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
.coinImage {
  max-width: 20px;
  max-height: 20px;
}
.softwareCoinVOS-list {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 12px;
}
.icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 5px;
}
</style>
