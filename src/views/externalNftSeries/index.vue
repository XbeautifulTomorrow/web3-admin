<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入ID、名称" v-model="obscureField" clearable />
      <el-input class="public-input" style="width: 120px;" placeholder="输入项目方" v-model="projectParty" clearable />
      <!-- <el-select class="public-input" v-model="accountInfo" style="width: 120px">
        <el-option label="全部状态" value="ETH" />
        <el-option label="待审核" value="ETH" />
        <el-option label="未通过" value="ETH" />
        <el-option label="售卖中" value="ETH" />
        <el-option label="已出售" value="ETH" />
        <el-option label="已下架" value="ETH" />
      </el-select> -->
      <div class="public-date-box">
        <span class="demonstration">
          添加时间
        </span>
        <el-date-picker v-model="addTime" type="datetimerange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchNftExternalList()">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" class="public-search" @click="showDialog = true">
        创建NFT
      </el-button>
      <el-button type="primary" icon="el-icon-refresh" class="public-search" @click="fetchNftExternalList()">
        刷新
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">总藏品数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.collNumberTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总价值</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.priceTotal }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="系列ID" align="center" key="1">
      </el-table-column>
      <el-table-column prop="seriesImg" label="系列图" width="120px" align="center" key="2">
        <template slot-scope="scope">
          <div style="width: 100px; height: 100px">
            <el-image style="height: 100%;" :src="scope.row.seriesImg" :preview-src-list="[scope.row.seriesImg]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列名" align="center" key="3">
      </el-table-column>
      <el-table-column prop="contractAddress" label="合约" align="center" key="4">
      </el-table-column>
      <el-table-column prop="projectParty" label="项目方" align="center" key="5">
      </el-table-column>
      <el-table-column prop="marketName" label="市场" align="center" key="6">
      </el-table-column>
      <el-table-column prop="chainName" label="所在链" align="center" key="7">
      </el-table-column>
      <el-table-column prop="issuanceNumber" label="发行数量" align="center" key="8">
      </el-table-column>
      <el-table-column prop="inBoxNumber" label="可入盒数量" align="center" key="9">
      </el-table-column>
      <el-table-column prop="floorPrice" :label="`地板价(${coin})`" align="center" key="10">
      </el-table-column>
      <el-table-column prop="releaseTime" width="140" label="发行时间" align="center" key="11">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.releaseTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="relevancyBoxNumber" label="关联盲盒" align="center" key="12">
      </el-table-column>
      <el-table-column prop="createTime" width="140" label="添加时间" align="center" key="13">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="refreshTime" width="140" label="上次刷新" align="center" key="14">
        <template slot-scope="scope">
          {{ timeForStr(scope.row.refreshTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" key="15">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="handleDel(scope.row)">
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
    <el-dialog v-if="showDialog" title="创建NFT" :visible.sync="showDialog" width="540px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="130px">
        <el-form-item label="系列名称" prop="seriesName">
          <el-input v-model="ruleForm.seriesName" style="width: 300px" placeholder="请输入系列名称" />
        </el-form-item>
        <el-form-item label="合约地址" prop="contractAddress">
          <el-input v-model="ruleForm.contractAddress" style="width: 300px" placeholder="请输入合约地址">
            <template slot="append">
              <span @click="fetchNftSeries()">查询</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="系列图片" prop="seriesImg">
          <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileImg" :multiple="false" :limit="1"
            accept="image/png,image/jpg,image/jpeg" list-type="picture-card" :before-upload="handleBefore"
            :on-remove="handleRemove" :on-exceed="handExceed" :headers="uploadHeader">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所在链" prop="chainId">
          <el-select v-model="ruleForm.chainId" style="width: 300px">
            <el-option v-for="(item, index) in chainList" :key="index" :label="item.chainName" :value="item.chainId" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择市场" prop="marketId">
          <el-radio-group v-model="ruleForm.marketId">
            <el-radio-button v-for="(item, index) in markes" :label="item.id" :key="index">
              {{ item.marketName }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="ruleForm.keywords" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="项目方">
          <el-input v-model="ruleForm.projectParty" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="发行总量" prop="issuanceNumber">
          <el-input type="number" v-model.number="ruleForm.issuanceNumber" style="width: 300px" placeholder="请输入发行总量" />
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
import axios from "axios";
import { timeForStr } from '@/utils';
import pagination from '@/mixins/pagination';
import config from "@/config/env";
import { chainList, getNftAddress } from "@/utils/chain";
export default {
  name: 'ExternalNftSeries',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      showDialog: false,
      obscureField: null,
      projectParty: null,
      addTime: null,
      page: 1,
      size: 20,
      tableData: null,
      aggregateQuery: {},
      baseUserPage: null,
      uploadUrl: "",
      fileImg: [],
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      ruleForm: {
        "chainId": null, //链ID
        "marketId": null, //市场ID
        "seriesName": null, //系列名称
        "seriesImg": null, //系列图片
        "contractAddress": null, //合约地址
        "keywords": null, //关键字
        "projectParty": null, //项目方
        "issuanceNumber": null //发行数量
      },
      rules: {},
      markes: [],
      chainList: chainList
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    timeForStr: timeForStr,
    async fetchMarketManagerList() {
      const res = await this.$http.getMarketManagerList({
        page: 1, size: 9999
      });
      if (res) {
        this.markes = res.records;
      }

    },
    searchFun() {
      let { addTime } = this;
      let startTime = null;
      let endTime = null;
      if (addTime && addTime[0]) {
        startTime = timeForStr(addTime[0], 'YYYY-MM-DD HH:mm:ss');
      }
      if (addTime && addTime[1]) {
        endTime = timeForStr(addTime[1], 'YYYY-MM-DD HH:mm:ss');
      }

      return {
        obscureField: this.obscureField,
        projectParty: this.projectParty,
        startTime,
        endTime
      };
    },
    // 加载列表
    async fetchNftExternalList(isSearch = true) {
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
      const res = await this.$http.getNftExternalList(data);
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
    // 删除
    handleDel(row) {
      this.$confirm(`确定要删除系列『${row.seriesName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = await this.$http.nftExternalDel({
            id: row.id
          });
          if (res) {
            this.fetchNftExternalList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDialog = false
    },
    handleUpload(res) {
      if (res.code == 200) {
        this.fileImg.push({ url: res.data });
        this.ruleForm.seriesImg = res.data;
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
    handleRemove(file, fileList) {
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
          let ruleForm = { ...this.ruleForm };
          ruleForm.seriesImg = this.fileImg[0].url;
          const res = await this.$http.nftExternalAdd({ ...ruleForm });
          if (res) {
            this.handleClose();
            this.$refs["ruleForm"].resetFields();
            this.$message.success("操作成功！");
            this.fetchNftExternalList();
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
      console.log(getNftAddress)
      const { contractAddress } = this.ruleForm
      axios
        .get(getNftAddress + contractAddress, {
          responseType: "json",
        })
        .then((res) => {
          if (res.status == 200) {
            const nftData = res.data;
            this.fileImg = [{ url: nftData.image_url }]
            this.ruleForm.seriesName = nftData.name; // 系列名称
            this.ruleForm.seriesImg = nftData.image_url; // Nft图片
            this.ruleForm.keywords = nftData.collection.slug; // 关键字
            return
          }
          this.$message.error("查询失败，请检查合约地址是否正确");

        })
        .catch(error => {
          this.$message.error("查询失败，请检查合约地址是否正确");
          console.log(error);
        });

    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchNftExternalList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchNftExternalList(false);
    },
  },
  // 创建后
  created() {
    this.fetchNftExternalList();
    this.fetchMarketManagerList();
    this.uploadUrl = config.api + "/file/upload/image";

    this.rules = {
      chainId: [
        { required: true, message: "请选择链", trigger: ["blur", "change"] },
      ],
      marketId: [
        { required: true, message: "请选择市场", trigger: ["blur", "change"] },
      ],
      seriesName: [
        { required: true, message: "请输入系列名称", trigger: ["blur", "change"] },
      ],
      seriesImg: [
        { required: true, message: "请选择NFT图片", trigger: ["blur", "change"] },
      ],
      contractAddress: [
        { required: true, message: "请输入合约地址", trigger: ["blur", "change"] },
      ],
      keywords: [
        { required: true, message: "请输入关键字", trigger: ["blur", "change"] },
      ],
      issuanceNumber: [
        { required: true, message: "请输入发行数量", trigger: ["blur", "change"] },
      ]
    }
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
