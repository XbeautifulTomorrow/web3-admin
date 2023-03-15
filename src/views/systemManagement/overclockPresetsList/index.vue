<template>
  <div class="overclockPresets-list public-css">
    <div class="public-list-inputs pbulic-space-between">
      <div class="publick-search-list">
        <!-- 输入名称 -->
        <el-input
          class="public-input"
          :placeholder="
            `${$t('public.write')}${$t('overclockPresets.graphicsCardName')}`
          "
          v-model="graphicsCardName"
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
        <!-- 算法ID -->
        <el-select
          v-model="algorithmId"
          class="public-select-box"
          popper-class="public-select-box"
          :placeholder="`${$t('public.select')}${$t('currency.algNumber')}`"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.algorithmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- 显卡类型 -->
        <el-radio-group v-model="graphicsCard" @change="graphicsCardChangeFun">
          <el-radio-button label="AMD"></el-radio-button>
          <el-radio-button label="NVIDIA"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="public-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          class="public-search"
          @click="templatePresetFindPresetListApi"
        >
          {{ $t('public.search') }}
        </el-button>
        <el-button
          type="success"
          class="public-search"
          @click="showPopup(null)"
        >
          {{ $t('overclockPresets.addPresets') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <!-- ID -->
      <el-table-column :label="$t('farmList.id')" align="center">
        <span slot-scope="scope">{{ scope.row.id || '--' }}</span>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column :label="$t('farmList.name')" align="center">
        <span slot-scope="scope">{{ scope.row.graphicsCardName || '--' }}</span>
      </el-table-column>
      <!-- 显存大小 -->
      <el-table-column
        :label="$t('graphicsCardList.graphicsCardMemory')"
        align="center"
      >
        <span slot-scope="scope">{{
          scope.row.graphicsCardMemory || '--'
        }}</span>
      </el-table-column>
      <!-- 相关算法 -->
      <el-table-column :label="$t('overclockPresets.algorithm')" align="center">
        <span slot-scope="scope">{{ scope.row.algorithmName || '--' }}</span>
      </el-table-column>
      <!-- 显卡品牌 -->
      <el-table-column
        :label="$t('overclockPresets.graphicsCard')"
        align="center"
      >
        <span>{{ graphicsCard || '--' }}</span>
      </el-table-column>
      <!-- 效率 -->
      <el-table-column
        :label="$t('overclockPresets.efficiency')"
        align="center"
      >
        <span slot-scope="scope">
          {{
            scope.row.efficiency
              ? `${Number(scope.row.efficiency).toFixed(2)}%`
              : '--'
          }}
        </span>
      </el-table-column>
      <!-- 基数 -->
      <el-table-column
        :label="$t('overclockPresets.baseNumber')"
        align="center"
      >
        <span slot-scope="scope">
          {{ scope.row.baseNumber || '--' }}
        </span>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('userList.operate')" align="center">
        <template slot-scope="scope">
          <span
            class="blueColor publick-button cursor"
            @click="showPopup(scope.row)"
          >
            {{ $t('userList.details') }}
          </span>
          <span
            class="blueColor publick-button cursor"
            @click="templatePresetDeleteApi(scope.row)"
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
    <overclockPresetsDetails
      v-if="detailsDialog"
      :popupDialog="detailsDialog"
      :detailsData="detailsData"
      :graphicsCard="graphicsCard"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import pagination from '../../../mixins/pagination';
import overclockPresetsDetails from './overclockPresetsDetails.vue';
export default {
  name: 'OverclockPresets',
  // 模板引入
  components: { overclockPresetsDetails },
  mixins: [pagination],
  // 数据
  data() {
    return {
      id: '',
      graphicsCardName: '',
      algorithmId: '',
      graphicsCard: 'AMD',
      options: [],
      tableData: [],
      userMinerPage: null,
      size: 20,
      page: 1,
      detailsDialog: false,
      detailsData: null,
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.detailsDialog = false;
      this.detailsData = null;
      const _type = Object.prototype.toString.call(isApi);
      if (isApi && _type === '[object Boolean]') {
        this.templatePresetFindPresetListApi();
      }
    },
    showPopup(data = '') {
      this.detailsDialog = true;
      if (data) {
        this.detailsData = data;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      const { page } = this;
      if (page === 1) {
        this.templatePresetFindPresetListApi();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.templatePresetFindPresetListApi(false);
    },
    graphicsCardChangeFun(card) {
      this.templatePresetFindPresetListApi();
    },
    searchFun() {
      return {
        id: this.id,
        graphicsCardName: this.graphicsCardName,
        algorithmId: this.algorithmId,
      };
    },
    async algorithmBaseFindListApi() {
      const res = await this.$http.algorithmBaseFindList();
      if (res) {
        this.options = res;
      }
    },
    async templatePresetFindPresetListApi(isSearch = true) {
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
      const { graphicsCard } = this;
      let res = null;
      if (graphicsCard === 'AMD') {
        res = await this.$http.templatePresetFindAmdPresetList(data);
      } else {
        res = await this.$http.templatePresetFindNvidiaPresetList(data);
      }
      if (res) {
        this.userMinerPage = res;
        this.tableData = res.records;
      }
    },
    async templatePresetDeleteApi(data) {
      const { graphicsCard } = this;
      let res = null;
      if (graphicsCard === 'AMD') {
        res = await this.$http.templatePresetAmdDelete({ id: data.id });
      } else {
        res = await this.$http.templatePresetNvidiaDelete({ id: data.id });
      }
      if (res) {
        this.$message.success(
          this.$t('public.deteleSuc').replace(/{name}/, data.graphicsCardName)
        );
        this.templatePresetFindPresetListApi();
      }
    },
  },
  // 创建后
  created() {
    this.size = this.pagination.size;
    this.page = this.pagination.page;
    this.templatePresetFindPresetListApi();
    this.algorithmBaseFindListApi();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped></style>
