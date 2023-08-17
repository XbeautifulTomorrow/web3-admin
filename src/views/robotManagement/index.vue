<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <div class="remittance-box">
        <div class="remittance-amount remittance-more">
          <div class="remittance-item">
            <div class="title">机器人数量</div>
            <div class="val">
              {{ statisticsData && statisticsData.totalWalletNum }}
            </div>
          </div>
          <div class="remittance-item">
            <div class="title">机器人余额</div>
            <div class="val">
              {{ statisticsData && statisticsData.totalAssetBalance }}
            </div>
          </div>
        </div>
      </div>
      <el-button type="primary" icon="el-icon-plus" class="public-search" @click="dialogVisiblePoint = true"> 批量上下分 </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="boxId" label="盲盒ID" align="center"> </el-table-column>
      <el-table-column prop="boxName" label="盲盒名称" align="center"> </el-table-column>
      <el-table-column prop="price" label="单抽价格" align="center"> </el-table-column>
      <el-table-column prop="boxOpenNumber" label="机器人开盒数" align="center"> </el-table-column>
      <el-table-column prop="boxOpenExpenditure" label="机器人开盒支出" align="center"> </el-table-column>
      <el-table-column prop="boxLotteryPrice" label="机器人中奖价值" align="center"> </el-table-column>
      <el-table-column prop="intervalTime" label="间隔时间" align="center"> </el-table-column>
      <el-table-column prop="oneOrder" label="单抽几率" align="center"> </el-table-column>
      <el-table-column prop="fiveOrder" label="五连几率" align="center"> </el-table-column>
      <el-table-column prop="tenOrder" label="十连几率" align="center"> </el-table-column>
      <el-table-column prop="gasWalletAddress" label="状态" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.botStatus == 'TRUE'" style="color: #67c23a">进行中</p>
          <p v-else style="color: #f56c6c">已停止</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="operatingFunc(scope.row, 'open')" v-if="scope.row.botStatus == 'FALSE'">
            开启
          </span>
          <span class="blueColor publick-button cursor" @click="operatingFunc(scope.row, 'close')" v-else> 关闭 </span>
          <span class="blueColor publick-button cursor" @click="setFun(scope.row)">配置</span>
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
    <el-dialog title="机器人配置" :visible.sync="dialogVisible" width="30%">
      <el-form ref="ruleForm" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="盲盒名称">
          <p class="infor">{{ ruleForm.boxName }}</p>
        </el-form-item>
        <el-form-item label="单抽价格">
          <p class="infor">{{ ruleForm.price }}</p>
        </el-form-item>
        <el-form-item label="机器人开盒数">
          <p class="infor">{{ ruleForm.boxOpenNumber }}</p>
        </el-form-item>
        <el-form-item label="机器人开盒支出">
          <p class="infor">{{ ruleForm.boxOpenExpenditure }}</p>
        </el-form-item>
        <el-form-item label="机器人中奖价值">
          <p class="infor">{{ ruleForm.boxLotteryPrice }}</p>
        </el-form-item>
        <el-form-item label="间隔时间" prop="intervalTime" :rules="rules.blur">
          <el-input v-model.number="ruleForm.intervalTime" type="number" autocomplete="off">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单抽几率" prop="oneOrder" :rules="rules.blur">
          <el-input v-model.number="ruleForm.oneOrder" type="number" autocomplete="off"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="五连几率" prop="fiveOrder" :rules="rules.blur">
          <el-input v-model.number="ruleForm.fiveOrder" type="number" autocomplete="off"><template slot="append">%</template></el-input>
        </el-form-item>
        <el-form-item label="十连几率" prop="tenOrder" :rules="rules.blur">
          <el-input v-model.number="ruleForm.tenOrder" type="number" autocomplete="off"><template slot="append">%</template></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFunc">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量上下分" :visible.sync="dialogVisiblePoint" width="30%">
      <el-form ref="ruleFormPoint" :model="ruleFormPoint" label-width="120px" :rules="rules">
        <el-form-item label="上分" prop="pointer" :rules="rules.blur">
          <el-input v-model.number="ruleFormPoint.pointer" type="number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePoint = false">取 消</el-button>
        <el-button type="primary" @click="savePointerFunc">确 定</el-button>
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
      dialogVisiblePoint: false,
      ruleForm: {},
      ruleFormPoint: {
        pointer: "",
      },
      rules: {
        blur: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      statisticsData: null,
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
      const statisticsData = await this.$http.getWalletRechargeStatistics(data);
      if (statisticsData) {
        this.statisticsData = statisticsData;
      }
    },
    setFun(row) {
      this.ruleForm = row;
      this.dialogVisible = true;
    },
    operatingFunc(row, type) {
      this.$confirm(`确定要${type == "open" ? `开启` : "关闭"}吗?`, "提示", {
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
    savePointerFunc() {
      this.$refs.ruleFormPoint.validate(async (valid) => {
        if (valid) {
          let res = await this.$http.boxBotUpdate({ ...this.ruleFormPoint });
          if (res) {
            this.dialogVisiblePoint = false;
            this.$refs["ruleFormPoint"].resetFields();
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
