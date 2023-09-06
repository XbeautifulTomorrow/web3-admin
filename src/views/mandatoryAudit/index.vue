<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px" placeholder="输入ID、昵称、邮箱搜索" v-model="obscureField" clearable />
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchMarketManagerList()"> 查询 </el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="public-search" @click="dialogVisible = true"> 添加 </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="userId" label="ID" align="center" key="1"> </el-table-column>
      <el-table-column prop="userName" label="昵称" align="center" key="2"> </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" key="3"> </el-table-column>
      <el-table-column prop="assetBalance" label="余额" align="center" key="4"> </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="110" key="5">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="operatingMarket(scope.row)"> 移除 </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="baseUserPage && baseUserPage.total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pagination.pageSizes"
      :page-size="size"
      layout=" sizes, prev, pager, next, jumper"
      :total="baseUserPage.total"
      class="public-pagination"
    >
    </el-pagination>
    <el-dialog title="添加强制审核名单" :close-on-click-modal="false" :visible.sync="dialogVisible" width="720px" top="5vh">
      <div class="search-box">
        <el-input
          class="public-input"
          style="width: 520px"
          placeholder="输入ID、昵称、邮箱搜索"
          v-model="searchObscureField"
          clearable
          @input="searchAddData"
        />
      </div>
      <el-table
        ref="multipleTable"
        :data="searchTableData"
        height="550"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" align="center" key="1"> </el-table-column>
        <el-table-column prop="userName" label="昵称" align="center" key="2"> </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" key="3"> </el-table-column>
        <el-table-column prop="assetBalance" label="余额" align="center" key="4"> </el-table-column>
      </el-table>
      <el-pagination
        v-if="searchBaseUserPage && searchBaseUserPage.total"
        background
        @size-change="searchHandleSizeChange"
        @current-change="searchHandleCurrentChange"
        :current-page="pageTwo"
        :page-sizes="pagination.pageSizes"
        :page-size="sizeTwo"
        layout=" sizes, prev, pager, next, jumper"
        :total="searchBaseUserPage.total"
        class="public-pagination"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFunc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from "@/utils";
import pagination from "@/mixins/pagination";
export default {
  name: "mandatoryAudit",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      obscureField: null,
      searchObscureField: null,
      page: 1,
      size: 20,
      pageTwo: 1,
      sizeTwo: 20,
      tableData: null,
      baseUserPage: null,
      searchTableData: null,
      searchBaseUserPage: null,
      dialogVisible: false,
      multipleSelection: [],
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    onSearch() {},
    // 加载列表
    async fetchMarketManagerList(isSearch = true) {
      const { size, obscureField } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        size: size,
        page: _page,
        obscureField,
      };
      const res = await this.$http.mandatoryReviewPageList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }
    },

    async getSearchTableData(isSearch = true) {
      const { sizeTwo, searchObscureField } = this;
      let _page = this.pageTwo;
      if (isSearch) {
        this.pageTwo = 1;
        _page = 1;
      }
      const data = {
        size: sizeTwo,
        page: _page,
        coin: "ETH",
        obscureField: searchObscureField,
      };
      const res = await this.$http.getUserlist(data);
      if (res) {
        this.searchBaseUserPage = res;
        this.searchTableData = res.records;
      }
    },
    searchAddData() {
      debounce(this.getSearchTableData(true), 1000);
    },
    operatingMarket(row) {
      this.$confirm(`确定要移除${row.userName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.mandatoryReviewRemove({
            id: row.id,
          });
          if (res) {
            this.fetchMarketManagerList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleSelection() {
      this.multipleSelection = [];
      this.$refs.multipleTable.clearSelection();
    },
    async saveFunc() {
      const userIds = this.multipleSelection.map((x) => x.id);
      const res = await this.$http.mandatoryReviewAdd({ userIds });
      if (res) {
        if (this.searchObscureField) {
          this.searchObscureField = null;
          this.getSearchTableData(true);
        }
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.toggleSelection();
        this.fetchMarketManagerList();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchMarketManagerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchMarketManagerList(false);
    },
    searchHandleSizeChange(val) {
      this.sizeTwo = val;
      this.getSearchTableData();
    },
    searchHandleCurrentChange(val) {
      this.pageTwo = val;
      this.getSearchTableData(false);
    },
  },
  // 创建后
  created() {
    this.fetchMarketManagerList();
    this.getSearchTableData();
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
