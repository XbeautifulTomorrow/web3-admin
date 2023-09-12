<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px" placeholder="输入ID、昵称、邮箱搜索" v-model="obscureField" clearable />
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="getTableListFunc()"> 查询 </el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="public-search" @click="dialogVisible = true"> 添加 </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">总上下分</div>
          <div class="val">
            {{ statisticsData?.scores }}
          </div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="userId" label="ID" align="center" key="1">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userId || "--" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="昵称" align="center" key="2"> </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" key="3"> </el-table-column>
      <el-table-column prop="assetBalance" label="余额" align="center" key="4"> </el-table-column>
      <el-table-column prop="score" label="总上下分" align="center" key="5">
        <template slot-scope="scope">
          <p>{{ scope.row.score || "--" }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="assetBalance" label="禁止提款" align="center" key="6">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.isWithdrawal"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            active-value="TRUE"
            inactive-value="FALSE"
            @change="mandatoryReviwUpdateFunc(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="assetBalance" label="禁止take" align="center" key="7">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.isTake"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            active-value="TRUE"
            inactive-value="FALSE"
            @change="mandatoryReviwUpdateFunc(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="assetBalance" label="禁止一元购" align="center" key="8">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.isOneDollarBuy"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            active-value="TRUE"
            inactive-value="FALSE"
            @change="mandatoryReviwUpdateFunc(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="180" key="9">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="operatingScore(scope.row)"> 上下分 </span>
          <span class="blueColor publick-button cursor" @click="operatingMarket(scope.row, 'remove')"> 移除 </span>
          <span class="blueColor publick-button cursor" @click="operatingMarket(scope.row)" v-if="scope.row.userType !== 'INNER'">
            转测试账号
          </span>
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
        <el-table-column prop="id" label="ID" align="center" key="1">
          <template slot-scope="scope">
            <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || "--" }}</p>
          </template>
        </el-table-column>
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
    <el-dialog title="上下分" :visible.sync="showUpDownDialog" width="440px" :close-on-click-modal="false" :before-close="handleClose">
      <div>
        <el-input-number v-model="score" style="width: 100%"></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="updateScore()">确 定</el-button>
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
      statisticsData: {},
      userId: null,
      showUpDownDialog: false,
      score: null,
      coin: "ETH",
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    onSearch() {},
    // 加载列表
    async getTableListFunc(isSearch = true) {
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
        if (_page > 1 && this.tableData?.length == 0) {
          this.getTableListFunc(true);
        }
      }
      delete data.size;
      delete data.page;
      const statisticsData = await this.$http.mandatoryReviwHeaderDataTotal(data);
      if (statisticsData) {
        this.statisticsData = statisticsData;
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
        coin: this.coin,
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
    // 打开上下分弹窗
    operatingScore(row) {
      this.userId = row.userId;
      this.showUpDownDialog = true;
    },
    handleClose(done) {
      this.score = null;
      this.userId = "";
      if (done) {
        done();
        return;
      }
      this.showUpDownDialog = false;
    },
    // 更新分数
    async updateScore() {
      const res = await this.$http.upAndDown({
        id: this.userId,
        amount: this.score,
        coin: this.coin,
      });

      if (res) {
        this.getTableListFunc();
        this.handleClose();
        this.$message.success("操作成功");
      }
    },
    operatingMarket(row, type) {
      let tip = type == "remove" ? `确定要移除${row.userName}吗?` : `确定要将${row.userName}转为测试账号吗?转后不可逆，请谨慎操作`;
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = null;
          if (type == "remove") {
            res = await this.$http.mandatoryReviewRemove({
              id: row.id,
            });
          } else {
            res = await this.$http.mandatoryReviwTransferTestAccount({
              userId: row.userId,
            });
          }
          console.log(res);
          if (res) {
            this.getTableListFunc(false);
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async mandatoryReviwUpdateFunc(row) {
      const res = await this.$http.mandatoryReviwUpdate({
        id: row.id,
        isWithdrawal: row.isWithdrawal,
        isTake: row.isTake,
        isOneDollarBuy: row.isOneDollarBuy,
      });
      if (res) {
        this.getTableListFunc(false);
        this.$message.success("操作成功");
      }
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
        this.getTableListFunc();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.getTableListFunc();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableListFunc(false);
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
    this.getTableListFunc();
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

<style lang="scss" scoped>
.remittance-box {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.remittance-amount {
  padding: 20px 0;
  border: 1px solid #666;
  text-align: center;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 50px;
  margin-bottom: 10px;

  .val {
    padding: 10px;
    padding-bottom: 0;
  }

  & > div {
    min-width: 200px;
  }
}
</style>
