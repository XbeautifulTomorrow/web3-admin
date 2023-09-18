<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <div class="remittance-box">
        <div class="remittance-amount remittance-more">
          <div class="remittance-item">
            <div class="title">总参与人数</div>
            <div class="val">{{ aggregateQuery && aggregateQuery.collNumberTotal }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总奖金</div>
            <div class="val">{{ aggregateQuery && aggregateQuery.collNumberTotal }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总体验金</div>
            <div class="val">{{ aggregateQuery && aggregateQuery.collNumberTotal }}</div>
          </div>
          <div class="remittance-item">
            <div class="title">总积分</div>
            <div class="val">{{ aggregateQuery && aggregateQuery.collNumberTotal }}</div>
          </div>
        </div>
      </div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="public-search" @click="handleAdd()"> 添加活动 </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="活动ID" align="center" key="1"> </el-table-column>
      <el-table-column prop="id" label="活动名称" align="center" key="2"> </el-table-column>
      <el-table-column prop="coinImage" label="横幅图片" width="120px" align="center" key="3">
        <template slot-scope="scope">
          <div style="width: 100px; height: 50px">
            <el-image style="height: 100%" :src="scope.row.coinImage" :preview-src-list="[scope.row.coinImage]"> </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="活动类型" align="center" key="4"> </el-table-column>
      <el-table-column prop="contractAddress" label="参与人数" align="center" key="5"> </el-table-column>
      <el-table-column prop="chainName" label="已领取/总奖金" align="center" key="6"> </el-table-column>
      <el-table-column prop="price" label="已领取/总体验金" align="center" key="7"> </el-table-column>
      <el-table-column prop="price" label="总积分" align="center" key="8"> </el-table-column>
      <el-table-column prop="relevancyBoxNumber" label="奖励记录" align="center" key="9"> </el-table-column>
      <el-table-column prop="openNumber" width="120" label="状态" align="center" key="10">
        <template slot-scope="scope">
          <p style="color: #67c23a" v-if="scope.row.status == 1">进行中</p>
          <p style="color: #e6a23c" v-else-if="scope.row.status == 2">未开始</p>
          <p style="color: #909399" v-else>已结束</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="140" label="开始时间" align="center" key="11">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="refreshTime" width="140" label="结束时间" align="center" key="12">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.refreshTime, "YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" key="13">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor"> 编辑 </span>
          <span class="blueColor publick-button cursor"> 详情 </span>
          <span class="blueColor publick-button cursor" @click="handleDel(scope.row)"> 提前开始 </span>
          <span class="blueColor publick-button cursor" @click="handleDel(scope.row)"> 提前结束 </span>
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
    <el-dialog
      v-if="showDialog"
      :title="operatingType == 1 ? '添加活动' : '编辑活动'"
      :visible.sync="showDialog"
      width="940px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      top="5vh"
    >
      <div class="add-form-box">
        <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="140px">
          <el-form-item label="活动类型" prop="chainId" :rules="rules.select">
            <el-select :disabled="operatingType != 1" v-model="ruleForm.chainId" style="width: 350px">
              <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称" prop="seriesName" :rules="rules.blur">
            <el-input v-model="ruleForm.seriesName" style="width: 350px" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="活动横幅" prop="coinImage" :rules="rules.select">
            <el-upload
              :action="uploadUrl"
              :disabled="operatingType != 1"
              :class="{ hide: hideUpload }"
              :on-change="handleChange"
              :on-success="handleUpload"
              :file-list="fileImg"
              :multiple="false"
              :limit="1"
              accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
              list-type="picture-card"
              :before-upload="handleBefore"
              :on-remove="handleRemove"
              :on-exceed="handExceed"
              :headers="uploadHeader"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
          <el-form-item label="一句话介绍" prop="seriesName" :rules="rules.blur">
            <el-input v-model="ruleForm.seriesName" style="width: 350px" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="最低充值" prop="price" :rules="rules.blur">
            <el-input
              :disabled="operatingType != 1"
              type="number"
              v-model="ruleForm.price"
              style="width: 350px"
              placeholder="请输入最低充值"
            >
              <template slot="append">{{ ruleForm.coin }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="奖金比率" prop="price" :rules="rules.blur">
            <el-input
              :disabled="operatingType != 1"
              type="number"
              v-model="ruleForm.price"
              style="width: 350px"
              placeholder="请输入奖金比率"
            >
              <template slot="append">倍</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最大奖金" prop="price" :rules="rules.blur">
            <el-input
              :disabled="operatingType != 1"
              type="number"
              v-model="ruleForm.price"
              style="width: 350px"
              placeholder="请输入最低充值"
            >
              <template slot="append">{{ ruleForm.coin }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="解锁所需流水倍率" prop="price" :rules="rules.blur">
            <el-input
              :disabled="operatingType != 1"
              type="number"
              v-model="ruleForm.price"
              style="width: 350px"
              placeholder="请输入奖金比率"
            >
              <template slot="append">倍</template>
            </el-input>
          </el-form-item>
          <div class="flex">
            <el-form-item label="解锁轮次" prop="price" :rules="rules.blur">
              <el-input type="number" v-model="ruleForm.price" style="width: 150px" placeholder="请输入解锁轮次">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
            <el-form-item label="解锁比率">
              <p style="line-height: 28px">{{ 10 }}%</p>
            </el-form-item>
          </div>
          <el-form-item label="起止时间" prop="coinName" :rules="rules.select">
            <el-date-picker
              style="width: 350px"
              v-model="fromToTime"
              type="datetimerange"
              range-separator="到"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动描述" prop="chainId" :rules="rules.select">
            <quillEditor :content="ruleForm.detail" @change="editorDetailFunc"></quillEditor>
          </el-form-item>
          <el-form-item label="条款与条件" prop="chainId" :rules="rules.select">
            <quillEditor :content="ruleForm.detail" @change="editorDetailFunc"></quillEditor>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-if="showDetailDialog" title="奖励记录" :visible.sync="showDetailDialog" width="1200px" :close-on-click-modal="false">
      <div class="page-wrapper showDetailDialog">
        <div class="public-list-inputs">
          <el-input class="public-input" style="width: 140px" placeholder="输入玩家昵称/ID" v-model="Id" clearable />
          <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchAssetFlowList()"> 查询 </el-button>
        </div>
        <div class="remittance-box">
          <div class="remittance-amount remittance-more">
            <div class="remittance-item">
              <div class="title">参与人数</div>
              <div class="val">{{ aggregateQuery?.flowNumberTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总充值</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总奖金</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总流水</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总解锁</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总领取</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
            <div class="remittance-item">
              <div class="title">总未领</div>
              <div class="val">{{ aggregateQuery?.amountTotal }}</div>
            </div>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="id" label="玩家ID/昵称" align="center" width="110" key="0">
            <template slot-scope="scope">
              <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.id || "--" }}</p>
              <p :style="{ color: scope.row.userType == 'INNER' ? 'red' : '#000' }">{{ scope.row.userName || "--" }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userId" width="120" label="充值金额" align="center" key="3"> </el-table-column>
          <el-table-column prop="createTime" label="充值时间" align="center" key="13">
            <template slot-scope="scope">
              {{ timeForStr(scope.row.createTime, "YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="flowType" label="总奖金" align="center" key="4">
            <template slot-scope="scope">
              {{ formatType(scope.row.flowType) }}
            </template>
          </el-table-column>
          <el-table-column prop="flowSource" label="已打流水" align="center" key="5">
            <template slot-scope="scope">
              {{ formatSource(scope.row.flowSource) }}
            </template>
          </el-table-column>
          <el-table-column prop="flashId" label="解锁奖金" align="center" key="6"> </el-table-column>
          <el-table-column prop="hash" label="领取奖金" align="center" key="7"> </el-table-column>
          <el-table-column prop="walletAddress" label="未领奖金" align="center" key="8"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetailDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { timeForStr } from "@/utils";
import pagination from "@/mixins/pagination";
import config from "@/config/env";
import { chainList } from "@/utils/chain";
import quillEditor from "@/components/quillEditor";
export default {
  name: "ExternalTokenManagement",
  // 模板引入
  components: { quillEditor },
  // 数据
  data() {
    return {
      typeOptions: [
        { label: "欢迎奖金", value: 1 },
        { label: "开盒赢积分", value: 2 },
        { label: "夺宝赢积分", value: 3 },
      ],
      showDialog: false,
      showDetailDialog: true,
      page: 1,
      size: 20,
      tableData: null,
      aggregateQuery: {},
      baseUserPage: null,
      uploadUrl: "",
      fileImg: [],
      limitCount: 1,
      hideUpload: false,
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      ruleForm: {
        seriesName: null, //系列名称
        coinName: null, //币种名称
        coinImage: null, //币种图片
        contractAddress: null, //合约地址
        chainId: null, //链ID
        chainName: null, //链名称
        reclaimRate: null, //回收比率
        price: null, //ETH价格
        coin: "ETH", //ETH币种
      },
      rules: {
        select: [{ required: true, message: "请选择", trigger: ["blur", "change"] }],
        blur: [{ required: true, message: "请输入", trigger: ["blur", "change"] }],
      },
      fromToTime: [],
      chainList: chainList,
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    timeForStr: timeForStr,
    searchFun() {
      let { addTime } = this;
      let startTime = null;
      let endTime = null;
      if (addTime && addTime[0]) {
        startTime = timeForStr(addTime[0], "YYYY-MM-DD HH:mm:ss");
      }
      if (addTime && addTime[1]) {
        endTime = timeForStr(addTime[1], "YYYY-MM-DD HH:mm:ss");
      }

      return {
        obscureField: this.obscureField,
        startTime,
        endTime,
      };
    },
    // 加载列表
    async getTableList(isSearch = true) {
      const search = this.searchFun();
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
        ...search,
      };
      const res = await this.$http.externalCoinPageList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getNftExternalStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    // 刷新
    async refreshFunc() {
      const res = await this.$http.externalCoinRefresh();
      if (res) {
        this.getTableList();
        this.$message.success("操作成功");
      }
    },
    handleAdd() {
      this.operatingType = 1;
      this.hideUpload = false;
      this.showDialog = true;
    },
    handleEdit(row) {
      this.ruleForm = {
        ...row,
      };

      this.fileImg = [{ url: row.coinImage }];
      this.operatingType = 2;
      this.hideUpload = true;
      this.showDialog = true;
    },
    editorDetailFunc(data) {
      this.ruleForm.detail = data;
      console.log(data, "-------------------");
    },
    // 删除
    handleDel(row) {
      this.$confirm(`确定要删除系列『${row.seriesName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = await this.$http.externalCoinDelete({
            id: row.id,
          });
          if (res) {
            this.getTableList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleClose(done) {
      this.fileImg = [];
      this.$refs["ruleForm"].clearValidate();

      if (done) {
        done();
        return;
      }

      this.showDialog = false;
    },
    handleUpload(res) {
      if (res.code == 200) {
        this.fileImg.push({ url: res.data });
        this.ruleForm.coinImage = res.data;
        return;
      }
      this.$message.error("上传失败");
    },
    handleBefore(file) {
      const _this = this;
      const is1M = file.size / 1024 / 1024 < 2; // 限制小于2M
      if (!is1M) {
        _this.$message.error("文件过大，文件大小小于2M");
      }
      return is1M;
    },
    handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
      this.fileImg = [];
    },
    handExceed(fiel) {
      this.$message.error("文件只能上传一个");
    },
    // 提交
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.fileImg.length == 0) {
            this.$message.error("请上传图片！");
            return;
          }

          let ruleForm = {
            ...this.ruleForm,
          };

          let res = null;
          if (this.operatingType == 1) {
            ruleForm.chainName = this.chainList.filter((x) => x.chainId == ruleForm.chainId)[0].chainName;
            ruleForm.coinImage = this.fileImg[0].url;
            ruleForm.reclaimRate = ruleForm.reclaimRate / 100;
            res = await this.$http.externalCoinAdd({ ...ruleForm });
          } else {
            res = await this.$http.nftExternalUpdate({ ...ruleForm });
          }
          if (res) {
            this.handleClose();
            this.$refs["ruleForm"].resetFields();
            this.$message.success("操作成功！");
            this.getTableList();
            this.fileImg = [];
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @description 查询Nft系列
     */
    fetchNftSeries() {
      const { chainId, contractAddress } = this.ruleForm;
      if (!chainId) {
        this.$message.warning("请选择网络");
        return;
      }

      let getUrl = config.api + "/nft-external-series/assetContract/goerli/";
      if (chainId == 1) {
        getUrl = config.api + "/nft-external-series/assetContract/eth/";
      }

      axios
        .get(getUrl + contractAddress, {
          responseType: "json",
          headers: {
            "X-API-KEY": "3eb9844d094945f288c104c770365ac8",
          },
        })
        .then((res) => {
          if (res.status == 200) {
            const nftData = res.data;
            this.fileImg = [{ url: nftData.image_url }];
            this.ruleForm.seriesName = nftData.name; // 系列名称
            this.ruleForm.coinImage = nftData.image_url; // Nft图片
            this.ruleForm.keywords = nftData.collection.slug; // 关键字
            return;
          }
          this.$message.error("查询失败，请检查合约地址是否正确");
        })
        .catch((error) => {
          this.$message.error("查询失败，请检查合约地址是否正确");
          console.log(error);
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
    this.uploadUrl = config.api + "/file/upload/image";
  },
  // 计算属性
  computed: {
    coin() {
      return this.$store.getters.coinConfig;
    },
    userType() {
      return this.$store.getters.accountConfig;
    },
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
.hide {
  /deep/ .el-upload--picture-card {
    display: none;
  }
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
.flex {
  display: flex;
  align-items: center;
}
.add-form-box {
  max-height: 75vh;
  overflow-y: auto;
}
.showDetailDialog .remittance-amount > div {
  min-width: 150px;
}
</style>
<style>
.ql-container.ql-snow {
  background: rgb(36, 21, 55);
}
</style>
