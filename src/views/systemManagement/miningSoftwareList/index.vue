<template>
  <div class="miner-list public-css">
    <div class="public-list-inputs pbulic-space-between">
      <div class="publick-search-list">
        <!-- 输入名称 -->
        <el-input
          class="public-input"
          :placeholder="
            `${$t('public.write')}${$t('miningSoftware.miningSoftware')}`
          "
          v-model="name"
          clearable
        />
        <!-- 输入ID -->
        <el-input
          class="public-input"
          type="number"
          :placeholder="`${$t('public.write')}${$t('farmList.id')}`"
          v-model.number="id"
          clearable
        />
        <!-- 输入币种 -->
        <el-input
          class="public-input"
          :placeholder="`${$t('public.write')}${$t('miningSoftware.coinName')}`"
          v-model="coinName"
          clearable
        />
      </div>
      <div class="public-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="public-search"
          @click="miningSoftwarePageListApi"
        >
          {{ $t('public.search') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopup(null)"
        >
          {{ $t('miningSoftware.addMiningSoftware') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopupUpload"
        >
          {{ $t('miningSoftware.uploadMiningSoftware') }}
        </el-button>
      </div>
    </div>
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
            class="softwareConiVOS-list"
            v-for="(item, index) in scope.row.softwareCoinVOS"
            :key="`softwareCoinVOS-${index}`"
          >
            <template v-if="item.coinConfigVO">
              <div class="softwareConiVOS-list-coin">
                <img class="icon" :src="item.coinConfigVO.coinImage" alt="" />
                <span>{{ item.coinConfigVO.coinName }}</span>
              </div>
              <span class="softwareConiVOS-list-al">{{ item.algName }}</span>
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
            <span>{{ item.version }}</span>
            <span v-if="item.downloadPath"> ,{{ item.downloadPath }} </span>
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
      <el-table-column :label="$t('userList.operate')" align="center">
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
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="userMinerPage && userMinerPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="userMinerPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <miningSoftwareDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      @closePopup="closePopup"
    />
    <upload
      v-if="uploadMiningSoftware"
      :popupDialog="uploadMiningSoftware"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import { tzTimeFormate } from '../../../filters';
import pagination from '../../../mixins/pagination';
import miningSoftwareDetails from './miningSoftwareDetails.vue';
import upload from './upload.vue';
export default {
  name: 'MiningSoftwareList',
  // 模板引入
  components: { miningSoftwareDetails, upload },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      name: '',
      coinName: '',
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
      uploadMiningSoftware: false,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.detailsDialog = false;
      this.uploadMiningSoftware = false;
      this.detailsData = null;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.miningSoftwarePageListApi();
      }
    },
    showPopup(data = '') {
      this.detailsDialog = true;
      if (data) {
        this.detailsData = data;
      }
    },
    showPopupUpload() {
      this.uploadMiningSoftware = true;
    },
    handleSizeChange(val) {
      this.size = val;
      const { page } = this;
      if (page === 1) {
        this.miningSoftwarePageListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.miningSoftwarePageListApi(false);
    },
    timeFormateFun(time) {
      const _time = tzTimeFormate(time);
      return _time;
    },
    searchFun() {
      return {
        id: this.id,
        name: this.name,
        coinName: this.coinName,
      };
    },
    async miningSoftwarePageListApi(isSearch = true) {
      const search = this.searchFun();
      let { page, size } = this;
      if (isSearch) {
        page = 1;
      }
      const data = {
        ...{
          size,
          page,
        },
        ...search,
      };
      const res = await this.$http.miningSoftwarePageList(data);
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async miningSoftwareEnableStatusApi(data) {
      const res = await this.$http.miningSoftwareEnableStatus({
        id: data.id,
        enableStatus: data.enableStatus === 'NORMAL' ? 'FORZEN' : 'NORMAL',
      });
      if (res) {
        if (data.enableStatus === 'NORMAL') {
          this.$message.success(
            this.$t('userList.FORZENSUC').replace(/{name}/, data.name)
          );
        } else {
          this.$message.success(
            this.$t('userList.unblockSuc').replace(/{name}/, data.name)
          );
        }
        this.miningSoftwarePageListApi();
      }
    },
    async miningSoftwareDeleteApi(data) {
      const res = await this.$http.miningSoftwareDelete({ id: data.id });
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.name)
        );
        this.miningSoftwarePageListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.miningSoftwarePageListApi();
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
.softwareConiVOS-list {
  display: flex;
  justify-content: space-between;
}
.softwareConiVOS-list-al {
  min-width: max-content;
  margin-left: 7px;
}
</style>
