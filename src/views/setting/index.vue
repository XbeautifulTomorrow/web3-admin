<template>
  <div class="page-wrapper">
    <div class="points-settings">
      <div class="setting-item">
        <div class="setting-title">注册拉新开始时间</div>
        <div class="setting-val">
          <el-date-picker class="public-input" style="width: 300px;" value-format="yyyy-MM-dd HH:mm:ss"
            v-model="points.regCountdownTime" type="datetime" placeholder="Select time" />
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">下级佣金比例</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入下级佣金比例"
            v-model="points.downCommissionRate" clearable>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">下级空投积分额外比例</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入下级空投积分额外比例"
            v-model="points.downPointRate" clearable>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">消费积分系数</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入消费积分系数"
            v-model="points.consumePointRate" clearable>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <el-button type="primary" style="width: 160px;" size="medium" @click="submitPoints()">确认修改</el-button>
    </div>
    <div class="withdrawal-settings">
      <div class="setting-item">
        <div class="setting-title">提现手续费</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入提现手续费"
            v-model="withdrawals.withdrawalFees" clearable>
            <template slot="append">{{ coin }}</template>
          </el-input>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">
          <span>提现限制</span>
          <el-tooltip class="item" effect="dark" content="用户提款的限制，即无、每天、每周还是每月共能提多少" placement="top-start">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入提现总量"
            v-model="withdrawals.withdrawalLimits" clearable>
            <template slot="append">{{ coin }}</template>
          </el-input>
          <el-select style="width: 200px;" v-model="withdrawals.withdrawalDayLimits" class="public-select-box"
            placeholder="选择时段">
            <el-option label="每日" :value="1" />
            <el-option label="每周" :value="7" />
            <el-option label="每月" :value="30" />
          </el-select>
        </div>
      </div>
      <el-button type="primary" style="width: 160px;" size="medium" @click="submitWithdrawal()">确认修改</el-button>
    </div>
    <div class="recycling-settings">
      <div class="setting-item">
        <div class="setting-title">外部NFT回收比例</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入回收比例" v-model="nftReclaimRate"
            clearable>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <el-button type="primary" style="width: 160px;" size="medium" @click="submitRecycle()">确认修改</el-button>
    </div>
    <div class="recycling-settings">
      <div class="setting-item">
        <div class="setting-title">一元购服务费</div>
        <div class="setting-val">
          <el-input class="public-input" type="number" style="width: 300px;" placeholder="输入服务费" v-model="serviceFee"
            clearable>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <el-button type="primary" style="width: 160px;" size="medium" @click="submitServiceFee()">确认修改</el-button>
    </div>
    <div class="wallet-settings">
      <div class="operating-box">
        <span>归集钱包设置</span>
        <el-button type="primary" style="width: 160px;" @click="showDialog = true">新增钱包</el-button>
      </div>
      <el-table :data="tableData" style="width: 760px;min-width: 0;" class="public-table" border>
        <el-table-column prop="walletAddress" width="320" label="钱包地址" align="center" key="1">
        </el-table-column>
        <el-table-column prop="flowId" width="200" label="余额" align="center" key="2">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.innetWalletList" :key="index">
              {{ `${item.coin}:${item.assetBalance}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="walletStatus" width="100" label="激活状态" align="center" key="3">
          <template slot-scope="scope">
            <span style="color: #04B000;" v-if="scope.row.walletStatus == 'NORMAL'">
              已激活
            </span>
            <span style="color: red;" v-else>
              未激活
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" key="4" fixed="right">
          <template slot-scope="scope">
            <span class="blueColor publick-button cursor" @click="walletActive(scope.row)">
              激活
            </span>
            <span class="blueColor publick-button cursor" @click="walletDel(scope.row)">
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
        layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
      </el-pagination>
    </div>
    <div class="invite-settings">
      <div class="setting-item" v-for="(item, index) in inviteList" :key="index">
        <div class="setting-title">
          <span v-if="index == 0">邀请文本</span>
        </div>
        <div class="setting-val">
          <el-input class="public-input" style="width: 100%" placeholder="输入邀请文本（单行）" v-model="item.text" clearable>
            <template slot="append">
              <el-button v-if="index == 0" @click="inviteAdd()">
                <i class="el-icon-plus"></i>
              </el-button>
              <el-button v-else @click="inviteDel(index)">
                <i class="el-icon-minus"></i>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      <el-button type="primary" style="width: 160px;" size="medium" @click="submitInvite()">确认修改</el-button>
    </div>
    <el-dialog v-if="showDialog" title="新增归集钱包" :visible.sync="showDialog" width="440px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form ref="ruleForm" class="add-form" label-width="80px">
        <el-form-item label="钱包地址" prop="reclaimRate">
          <el-input v-model="walletAddr" style="width: 300px" placeholder="请输入钱包地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bigNumber from "bignumber.js";
import { timeForStr, accurateDecimal, exportExcel } from '@/utils';
import pagination from '@/mixins/pagination';
import config from "@/config/env";
export default {
  name: 'Setting',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      /** 积分相关配置 */
      points: {
        downCommissionRate: null, // 下级佣金比例
        downPointRate: null, // 下级积分比例
        consumePointRate: null, // 消费积分
        regCountdownTime: null // 
      },

      /** 提现相关配置 */
      withdrawals: {
        coin: null, //币种
        withdrawalFees: null, //提现手续费
        withdrawalLimits: null, //提款限制
        withdrawalDayLimits: null //限制天数
      },

      /** NFT回收相关配置 */
      nftReclaimRate: null,

      /** 一元购服务费 */
      serviceFee: null,

      /** 钱包相关 */
      showDialog: false,
      walletAddr: null,

      /** 邀请文本相关 */
      inviteList: [{ text: "" }],

      page: 1,
      size: 20,
      tableData: null,
      baseUserPage: null,
      aggregateQuery: null
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 加载列表
    async fetchSystemWalletList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        walletType: "GATHER",
        size: size,
        page: _page
      };
      const res = await this.$http.getSystemWalletList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }
    },
    // 积分配置查询
    async fetchPointConfig() {
      const res = await this.$http.getPointConfig();

      if (res) {
        this.points = {
          ...res,
          downCommissionRate: new bigNumber(res.downCommissionRate).multipliedBy(100).toFixed(2), //下级佣金比例
          downPointRate: new bigNumber(res.downPointRate).multipliedBy(100).toFixed(2), //下级积分比例
          consumePointRate: new bigNumber(res.consumePointRate).multipliedBy(100).toFixed(2) //消费积分
        };

        this.$forceUpdate();
      }
    },
    // 积分配置更新
    async submitPoints() {
      const {
        downCommissionRate,
        downPointRate,
        consumePointRate
      } = this.points;

      if (
        !downCommissionRate ||
        !downPointRate ||
        !consumePointRate) {
        this.$message.error("积分配置相关参数不完整，请补充完整后重试");
        return
      }

      const res = await this.$http.pointConfigSet({
        ...this.points,
        downCommissionRate: accurateDecimal(new bigNumber(this.points.downCommissionRate).dividedBy(100), 4), //下级佣金比例
        downPointRate: accurateDecimal(new bigNumber(this.points.downPointRate).dividedBy(100), 4), //下级积分比例
        consumePointRate: accurateDecimal(new bigNumber(this.points.consumePointRate).dividedBy(100), 4) //消费积分
      });

      if (res) {
        this.fetchPointConfig();
        this.$message.success("操作成功");
      }
    },
    // 提现配置查询
    async fetchWithdrawalConfig() {
      const res = await this.$http.getWithdrawalConfig({ coin: this.coin });
      if (res) {
        this.withdrawals = {
          ...res
        };

        this.$forceUpdate();
      }
    },
    // 提现配置更新
    async submitWithdrawal() {
      const {
        withdrawalFees,
        withdrawalLimits,
        withdrawalDayLimits
      } = this.withdrawals;

      if (
        !withdrawalFees ||
        !withdrawalLimits ||
        !withdrawalDayLimits) {
        this.$message.error("提现配置相关参数不完整，请补充完整后重试");
        return
      }

      const res = await this.$http.withdrawalConfigSet({
        coin: this.coin,
        ...this.withdrawals
      });

      if (res) {
        this.fetchWithdrawalConfig();
        this.$message.success("操作成功");
      }
    },
    // NFT回收配置查询
    async fetchRecycleConfig() {
      const res = await this.$http.getRecycleConfig({ coin: this.coin });
      if (res) {
        this.nftReclaimRate = accurateDecimal(new bigNumber(res.nftReclaimRate).multipliedBy(100), 2);
        this.$forceUpdate();
      }
    },
    // NFT回收配置更新
    async submitRecycle() {
      const {
        nftReclaimRate,
      } = this;

      if (
        !nftReclaimRate) {
        this.$message.error("NFT回收配置相关参数不完整，请补充完整后重试");
        return
      }

      const res = await this.$http.recycleConfigSet({
        nftReclaimRate: accurateDecimal(new bigNumber(nftReclaimRate).dividedBy(100), 4)
      });

      if (res) {
        this.fetchRecycleConfig();
        this.$message.success("操作成功");
      }
    },
    // 一元购服务费
    async fetchServiceCharge() {
      const res = await this.$http.getServiceCharge({ coin: this.coin });
      if (res) {
        this.serviceFee = accurateDecimal(new bigNumber(res || 0).multipliedBy(100) || 0, 2);
        this.$forceUpdate();
      }
    },
    // 一元购服务费更新
    async submitServiceFee() {
      const {
        serviceFee,
      } = this;

      if (
        !serviceFee) {
        this.$message.error("请输入一元购服务费");
        return
      }

      const res = await this.$http.updateServiceCharge({
        servicePrice: accurateDecimal(new bigNumber(serviceFee).dividedBy(100), 4)
      });

      if (res) {
        this.fetchServiceCharge();
        this.$message.success("操作成功");
      }
    },
    // 新增归集钱包
    async submitForm() {
      if (!this.walletAddr) {
        this.$message.error("请输入归集钱包地址");
        return
      }

      const res = await this.$http.systemWalletAdd({
        walletAddress: this.walletAddr,
        walletType: "GATHER"
      });

      if (res) {
        this.handleClose();
        this.fetchSystemWalletList();
        this.$message.success("操作成功");
      }
    },
    //激活钱包
    walletActive(row) {
      this.$confirm(`确定要激活钱包『${row.walletAddress}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.systemWalletActive({
            id: row.id
          });
          if (res) {
            this.fetchSystemWalletList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //删除钱包
    walletDel(row) {
      this.$confirm(`确定要删除钱包『${row.walletAddress}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          const res = await this.$http.systemWalletDel({
            id: row.id
          });
          if (res) {
            this.fetchSystemWalletList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 新增邀请文本行
    inviteAdd() {
      this.inviteList.push({ text: "" });
      this.$forceUpdate();
    },
    // 删除邀请文本单行
    inviteDel(index) {
      this.inviteList.splice(index, 1)
      this.$forceUpdate();
    },
    // 邀请文本查询
    async fetchInviteSetting() {
      const res = await this.$http.getInviteSetting();
      if (res) {
        const invites = res.inviteText.split(",");
        this.inviteList = [];
        invites.forEach(element => {
          this.inviteList.push({ text: element })
        });

        this.$forceUpdate();
      }
    },
    // 邀请文本更新
    async submitInvite() {
      const {
        inviteList,
      } = this;
      let invites = "";
      inviteList.forEach(element => {
        if (!invites) {
          invites = element.text;
          return
        }

        invites += "," + element.text
      });;
      if (!invites) {
        this.$message.error("请输入邀请文本");
        return
      }

      const res = await this.$http.inviteSet({
        inviteText: invites
      });

      if (res) {
        this.fetchInviteSetting();
        this.$message.success("操作成功");
      }
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDialog = false
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchSystemWalletList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchSystemWalletList(false);
    },
  },
  // 创建后
  created() {
    this.fetchSystemWalletList();
    this.fetchPointConfig();
    this.fetchWithdrawalConfig();
    this.fetchRecycleConfig();
    this.fetchServiceCharge();
    this.fetchInviteSetting();
  },
  computed: {
    coin() {
      return this.$store.getters.coinConfig;
    },
    userType() {
      return this.$store.getters.accountConfig;
    },
  },
  // 挂载后
  mounted() { },
  // 更新后
  updated() { },
  // 销毁
  beforeDestroy() { },
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

  &>div {
    min-width: 200px;
  }
}

.remittance-more {
  display: flex;
}

.setting-item {
  display: flex;
  align-items: center;

  .setting-title {
    font-size: 16px;
    font-weight: bold;
    min-width: 200px;

    &>span {
      margin-right: 8px;
    }
  }

  .el-input {
    margin-bottom: 0;
  }

  .el-select {
    margin: 0 !important;
  }
}

.page-wrapper {
  &>div+div {
    margin-top: 40px;
  }
}

.setting-item+.setting-item {
  margin-top: 10px;
}

.setting-item+.el-button {
  margin-top: 10px;
}

.wallet-settings {
  width: 760px;
}

.invite-settings {
  width: 760px;
}

.operating-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
}
</style>
