<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入ID、昵称、邮箱、钱包地址" v-model="obscureField"
        clearable />
      <el-input class="public-input" placeholder="上级ID" type="number" v-model.number="upId" clearable />
      <el-select v-model="userStatus" class="public-select-box" popper-class="public-select-box" placeholder="全部状态"
        clearable>
        <el-option label="全部状态" value="">
        </el-option>
        <el-option label="封停" value="DISABLE">
        </el-option>
        <el-option label="正常" value="NORMAL">
        </el-option>
      </el-select>
      <div class="public-date-box">
        <span class="demonstration">
          注册时间
        </span>
        <el-date-picker v-model="registrationTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <div class="public-date-box">
        <span class="demonstration">最后登录时间:</span>
        <el-date-picker v-model="loginedTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchUserlist(true)">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="onExport()">
        导出
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="showDialog = true">
        导入测试号
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="downloadExcel()">
        下载模板
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">总用户数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.userNumberTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总购买数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.buyNumberTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总消费金额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.consumeTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总余额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.assetBalanceTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总收入金额</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.revenueTotal }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="用户ID/昵称" align="center" width="110" key="0">
        <template slot-scope="scope">
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || '--' }}</p>
          <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userName || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="upId" label="上级ID" align="center" width="110" key="1">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" width="200" key="2">
      </el-table-column>
      <el-table-column prop="walletAddress" label="钱包地址" align="center" width="320" key="3">
      </el-table-column>
      <el-table-column prop="totalConsumps" label="总消费(ETH)" align="center" width="110" key="4">
      </el-table-column>

      <el-table-column prop="totalRevenues" label="总收入(ETH)" align="center" width="110" key="5">
      </el-table-column>
      <el-table-column prop="buyBoxNumbers" label="购买盲盒个数" align="center" width="110" key="6">
      </el-table-column>
      <el-table-column prop="totalCollects" label="获得藏品" align="center" width="110" key="7">
      </el-table-column>
      <el-table-column prop="remainderCollects" label="剩余藏品" align="center" width="110" key="8">
      </el-table-column>
      <el-table-column prop="assetBalance" label="余额(ETH)" align="center" width="110" key="9">
      </el-table-column>
      <el-table-column prop="withdrawalFees" label="提款手续费(ETH)" align="center" width="140" key="10">
      </el-table-column>
      <el-table-column prop="withdrawalArrived" label="提款到账(ETH)" align="center" width="110" key="11">
      </el-table-column>
      <el-table-column prop="point" label="总积分" align="center" width="110" key="12">
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" align="center" width="140" key="13">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" align="center" width="140" key="14">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.lastLoginTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="最后登录IP" align="center" width="110" key="15">
      </el-table-column>
      <el-table-column prop="userStatus" label="状态" align="center" width="110" key="16">
        <template slot-scope="scope">
          <span style="color:red;" v-if="scope.row.userStatus == 'DISABLE'">封停</span>
          <span style="color:#21AE04;" v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="140" key="17" fixed="right">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="operatingScore(scope.row)">
            上下分
          </span>
          <span class="blueColor publick-button cursor">
            详情
          </span>
          <span class="blueColor publick-button cursor"
            :style="`color: ${scope.row.userStatus == 'DISABLE' ? '#09a9ff' : 'red'}`"
            @click="operatingAccount(scope.row)">
            {{ scope.row.userStatus == 'DISABLE' ? '解禁' : '封停' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
    <el-dialog :title="uploadType == 1 ? '导入测试账号' : '导入结果'" :visible.sync="showDialog"
      :width="uploadType == 1 ? '440px' : '1200px'" :close-on-click-modal="false" :before-close="handleClose">
      <div v-if="uploadType == 1">
        <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileExcel" :multiple="false" :limit="1"
          accept=".xls,.xlsx" list-type="picture-card" :before-upload="handleBefore" :on-remove="handleRemove"
          :on-exceed="handExceed" :headers="uploadHeader">
          <i class="el-icon-plus" />
        </el-upload>
      </div>
      <el-table :data="testData" v-else style="width: auto" border>
        <el-table-column prop="chainId" label="链ID" align="center" width="110" key="1">
        </el-table-column>
        <el-table-column prop="walletAddress" label="钱包地址" align="center" key="2">
        </el-table-column>
        <el-table-column prop="walletName" label="钱包名称" align="center" width="110" key="3">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" key="4">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="上下分" :visible.sync="showUpDownDialog" width="440px" :close-on-click-modal="false"
      :before-close="handleClose">
      <div>
        <el-input-number v-model="score" style="width: 100%;" size="medium" @change="handleChange"
          label="描述文字"></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="updateScore()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { timeForStr, exportExcel } from '@/utils';
import pagination from '@/mixins/pagination';
import config from "@/config/env";

export default {
  name: 'UserList',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      showDialog: false,
      uploadType: 1,
      testData: [],

      showUpDownDialog: false,
      score: 0,
      scoreId: '',

      obscureField: "",
      upId: "",
      userStatus: "",
      page: 1,
      size: 20,
      registrationTime: null,
      loginedTime: null,
      tableData: null,
      aggregateQuery: {},
      baseUserPage: null, //分页相关
      uploadUrl: "", //上传url
      fileExcel: [], //文件列表
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },

    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { registrationTime, loginedTime } = this;
      let startRegTime = '';
      let endRegTime = '';
      let startLoginTime = '';
      let endLoginTime = '';
      if (registrationTime && registrationTime[0]) {
        startRegTime = timeForStr(registrationTime[0], 'YYYY-MM-DD');
      }
      if (registrationTime && registrationTime[1]) {
        endRegTime = timeForStr(registrationTime[1], 'YYYY-MM-DD');
      }
      if (loginedTime && loginedTime[0]) {
        startLoginTime = timeForStr(loginedTime[0], 'YYYY-MM-DD');
      }
      if (loginedTime && loginedTime[1]) {
        endLoginTime = timeForStr(loginedTime[1], 'YYYY-MM-DD');
      }
      return {
        obscureField: this.obscureField,
        upId: this.upId,
        userStatus: this.userStatus,
        startRegTime,
        endRegTime,
        startLoginTime,
        endLoginTime,
      };
    },
    // 加载用户列表
    async fetchUserlist(isSearch = true) {
      const search = this.searchFun();
      const { size, coin, userType } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        ...{
          coin: coin,
          userType: userType,
          size: size,
          page: _page,
        },
        ...search,
      };
      const res = await this.$http.getUserlist(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getUserDataTotal(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    // 用户列表导出
    onExport() {
      const search = this.searchFun();
      const urlStr = config.api + '/user/exportExcel';
      const { coin, userType } = this;
      const data = {
        ...{
          coin: coin,
          userType: userType
        },
        ...search,
      };

      exportExcel(urlStr, data, "用户列表导出")
    },
    // 下载模板
    downloadExcel() {
      const urlStr = config.api + '/file/template/download';
      const data = {
        name: 'SIGN_ACCOUNT'
      };

      exportExcel(urlStr, data, "用户导入模板")
    },
    // 封停/解禁
    operatingAccount(row) {
      this.$confirm(`确定要${row.userStatus == 'DISABLE' ? '解禁' : '封停'}用户『${row.userName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = null;
          if (row.userStatus == 'DISABLE') {
            // 解禁
            res = await this.$http.accountThaw({
              id: row.id
            });
          } else {
            // 封停
            res = await this.$http.accountFreeze({
              id: row.id
            });
          }
          if (res) {
            this.fetchUserlist();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleChange(value) {
      // console.log(value);
    },
    // 打开上下分弹窗
    operatingScore(row) {
      this.scoreId = row.id;
      this.showUpDownDialog = true;
    },
    // 更新分数
    async updateScore() {
      const res = await this.$http.upAndDown({
        id: this.scoreId,
        amount: this.score,
        coin: this.coin
      });

      if (res) {
        this.fetchUserlist();
        this.handleClose();
        this.$message.success("操作成功");
      }
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDialog = false;
      this.showUpDownDialog = false;
      this.uploadType = 1;
      this.score = 0;
      this.scoreId = "";
      this.testData = [];
    },
    handleUpload(res) {
      this.uploadType = 2;
      this.testData = res.data;
      if (res.status == 200) {
        this.fileImg.push({ url: res.data });
        return;
      }

      this.$message.error("上传失败");
    },
    handleBefore(file) {
      const _this = this;
      const is1M = file.size / 1024 / 1024 < 100; // 限制小于100M
      if (!is1M) {
        _this.$message.error("文件过大，文件大小小于100M");
      }
      return is1M;
    },
    handleRemove(file, fileList) {
      this.fileImg = [];
    },
    handExceed(fiel) {
      this.$message.error("文件只能上传一个");
    },
    //控制每页数量
    handleSizeChange(val) {
      this.size = val;
      this.fetchUserlist();
    },
    //翻页
    handleCurrentChange(val) {
      this.page = val;
      this.fetchUserlist(false);
    },
  },
  computed: {
    coin() {
      return this.$store.getters.coinConfig;
    },
    userType() {
      return this.$store.getters.accountConfig;
    },
  },
  // 创建后
  created() {
    this.fetchUserlist();
    this.uploadUrl = config.api + "/user/importInner";
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
</style>
