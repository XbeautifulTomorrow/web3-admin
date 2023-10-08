<template>
  <div class="page-wrapper">
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="boxId" label="链ID" align="center"> </el-table-column>
      <el-table-column prop="boxName" label="链名" align="center"> </el-table-column>
      <el-table-column prop="price" label="全称" align="center"> </el-table-column>
      <el-table-column prop="boxOpenNumber" label="gas" align="center"> </el-table-column>
      <el-table-column prop="boxOpenExpenditure" label="几次确认" align="center"> </el-table-column>
      <el-table-column prop="gasWalletAddress" label="状态" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.botStatus == 'TRUE'" style="color: #67c23a">已启用</p>
          <p v-else style="color: #f56c6c">已停止</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="setFun(scope.row)">配置</span>
          <span class="blueColor publick-button cursor" @click="operatingFunc(scope.row, 'close')" v-if="scope.row.botStatus == 'TRUE'">
            停用
          </span>
          <span class="blueColor publick-button cursor" @click="operatingFunc(scope.row, 'open')" v-else>启用 </span>
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
    <el-dialog title="充提链配置" :visible.sync="dialogVisible" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="配置gas" prop="intervalTime" :rules="rules.blur">
          <el-input v-model.number="ruleForm.intervalTime" type="number" autocomplete="off"> </el-input>
        </el-form-item>
        <el-form-item label="配置确认次数" prop="oneOrder" :rules="rules.blur">
          <el-input v-model.number="ruleForm.oneOrder" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFunc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import { timeForStr } from "@/utils";
import pagination from "@/mixins/pagination";
export default {
  name: "walletOneDollarLottery",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      dialogVisible: false,
      ruleForm: {},
      rules: {
        blur: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 加载列表
    async getTableList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          size: size,
          page: _page,
        },
      };
      const res = await this.$http.getBoxBotPageList(data);
      if (res) {
        this.tableData = res.records;
      }
      delete data.size;
      delete data.page;
      const statisticsData = await this.$http.boxBotHeaderDataTotal(data);
      if (statisticsData) {
        this.statisticsData = statisticsData;
      }
    },
    setFun(row) {
      this.ruleForm = row;
      this.dialogVisible = true;
    },
    operatingFunc(row, type) {
      this.$confirm(`确定要${type == "open" ? `启用` : "停用"}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = null;
          if (type == "open") {
            // 开启
            res = await this.$http.boxBotOpen({
              boxId: row.boxId,
            });
          } else {
            // 关闭
            res = await this.$http.boxBotClose({
              boxId: row.boxId,
            });
          }
          if (res) {
            this.getTableList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    saveFunc() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await this.$http.boxBotUpdate({ ...this.ruleForm });
          if (res) {
            this.dialogVisible = false;
            this.getTableList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableList(false);
    },
  },
  // 创建后
  created() {
    this.getTableList();
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
.public-list-inputs {
  display: flex;
  justify-content: right;
}
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

.remittance-more {
  display: flex;
}
.public-list-inputs {
  display: flex;
  justify-content: space-between;
}
.infor {
  line-height: 28px;
}
</style>
