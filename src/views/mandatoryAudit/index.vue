<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px" placeholder="输入ID、昵称、邮箱搜索" v-model="Id" clearable />
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchMarketManagerList()"> 查询 </el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="public-search" @click="dialogVisible = true"> 添加33 </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="ID" align="center" key="1"> </el-table-column>
      <el-table-column prop="marketName" label="昵称" align="center" key="2"> </el-table-column>
      <el-table-column prop="chainName" label="邮箱" align="center" key="3"> </el-table-column>
      <el-table-column prop="contractAddress" label="余额" align="center" key="4"> </el-table-column>
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
    <el-dialog title="添加强制审核名单" :visible.sync="dialogVisible" width="520">
      <div class="search-box">
        <el-input class="public-input" style="width: 320px" placeholder="输入ID、昵称、邮箱搜索" v-model="Id" clearable />
      </div>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" align="center" key="1"> </el-table-column>
        <el-table-column prop="marketName" label="昵称" align="center" key="2"> </el-table-column>
        <el-table-column prop="chainName" label="邮箱" align="center" key="3"> </el-table-column>
        <el-table-column prop="contractAddress" label="余额" align="center" key="4"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFunc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/mixins/pagination";
export default {
  name: "MarketManagement",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      Id: null,
      marketName: null,
      marketStatus: null,
      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      dialogVisible: true,
      multipleSelection: [],
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    onSearch() {},
    // 加载列表
    async fetchMarketManagerList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        id: this.Id,
        marketName: this.marketName,
        marketStatus: this.marketStatus,
        size: size,
        page: _page,
      };
      const res = await this.$http.lotteryChainPageList();
      if (res) {
        this.baseUserPage = res;
        this.tableData = res;
      }
    },
    operatingMarket(row) {
      this.$confirm(`确定要移除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.marketThaw({
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
    saveFunc() {
      const ids = this.multipleSelection.map((x) => x.id);
      console.log(ids);
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchMarketManagerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchMarketManagerList(false);
    },
  },
  // 创建后
  created() {
    this.fetchMarketManagerList();
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
