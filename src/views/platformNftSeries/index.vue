<template>
  <div class="user-list-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入ID、名称" v-model="obscureField" clearable />
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchNftPlatformList()">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="showDialog = true">
        创建NFT
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
      <el-table-column prop="id" label="NFT ID" align="center" key="1">
      </el-table-column>
      <el-table-column prop="seriesImg" label="NFT图" width="120px" align="center" key="2">
        <template slot-scope="scope">
          <div style="width: 100px; height: 100px">
            <el-image style="height: 100%;" :src="scope.row.seriesImg" :preview-src-list="[scope.row.seriesImg]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="seriesType" label="类型" align="center" key="3">
        <template slot-scope="scope">
          {{ scope.row.seriesType == 'COIN' ? '币' : '图' }}
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列名称" align="center" key="4">
      </el-table-column>
      <el-table-column prop="price" :label="`价值(${coin})`" align="center" key="5">
      </el-table-column>
      <el-table-column prop="contractAddress" label="合约" align="center" key="6">
      </el-table-column>
      <el-table-column prop="relevancyBoxNumber" label="关联盲盒" align="center" key="7">
      </el-table-column>
      <el-table-column prop="relevancyUserNumber" label="用户持有" align="center" key="8">
      </el-table-column>
      <el-table-column prop="relevancyFoundryNumber" label="铸造数量" align="center" key="9">
      </el-table-column>
      <el-table-column prop="reclaimRate" label="回收比例" align="center" key="10">
        <template slot-scope="scope">
          {{ `${new bigNumber(scope.row.reclaimRate || 0).multipliedBy(100).toFixed(2)}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" key="11">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="handleEdit(scope.row)">
            编辑
          </span>
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
    <el-dialog v-if="showDialog" :title="operatingType == 1 ? '创建NFT' : '编辑NFT'" :visible.sync="showDialog" width="540px"
      :close-on-click-modal="false" :before-close="handleClose">
      <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="130px">
        <el-form-item label="名称" prop="seriesName" v-if="operatingType == 1">
          <el-input v-model="ruleForm.seriesName" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="Hash" prop="hash" v-if="operatingType == 1">
          <el-input v-model="ruleForm.hash" style="width: 300px" placeholder="请输入Hash" />
        </el-form-item>
        <el-form-item label="类型" prop="seriesType" v-if="operatingType == 1">
          <el-select v-model="ruleForm.seriesType" style="width: 300px" placeholder="请选择类型">
            <el-option label="币" value="COIN" />
            <el-option label="图" value="PIC" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="seriesImg" v-if="operatingType == 1">
          <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileImg" :multiple="false" :limit="1"
            accept="image/png,image/jpg,image/jpeg" list-type="picture-card" :before-upload="handleBefore"
            :on-remove="handleRemove" :on-exceed="handExceed" :headers="uploadHeader">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所在链" prop="chainId" v-if="operatingType == 1">
          <el-select v-model="ruleForm.chainId" style="width: 300px">
            <el-option v-for="(item, index) in chainList" :key="index" :label="item.chainName" :value="item.chainId" />
          </el-select>
        </el-form-item>
        <el-form-item label="价值" prop="price" v-if="operatingType == 1">
          <el-input type="number" v-model.number="ruleForm.price" style="width: 300px" placeholder="请输入价值">
            <template slot="append">{{ coin }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="回收比例" prop="reclaimRate">
          <el-input type="number" v-model.number="ruleForm.reclaimRate" style="width: 300px" placeholder="请输入回收比例">
            <template slot="append">%</template>
          </el-input>
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
import { timeForStr } from '@/utils';
import pagination from '@/mixins/pagination';
import config from "@/config/env";
import { chainList } from "@/utils/chain";
export default {
  name: 'PlatformNftSeries',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    var validateRate = (rule, value, callback) => {
      var patt = new RegExp(/^(100|[1-9]?\d(\.\d\d?\d?)?)$|0$/);
      if (!patt.test(value)) {
        callback(new Error('请输入0-100的百分数'));
      } else {
        callback();
      }
    };
    return {
      showDialog: false,
      obscureField: "",
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
      operatingType: 1,
      ruleForm: {
        "hash": "",// hash
        "chainId": null,// 链ID
        "coin": "ETH",// 币种
        "price": null,// 价格
        "seriesName": null,// 系列名称
        "seriesType": null,// 系列类型(COIN-币，PIC-图)
        "seriesImg": null,// 系列图片
        "reclaimRate": null// 回收比例
      },
      rules: {
        hash: [
          { required: true, message: "请输入Hash", trigger: ["blur", "change"] },
        ],
        chainId: [
          { required: true, message: "请选择链", trigger: ["blur", "change"] },
        ],
        price: [
          { required: true, message: "请输入价值", trigger: ["blur", "change"] },
        ],
        seriesName: [
          { required: true, message: "请输入名称", trigger: ["blur", "change"] },
        ],
        seriesType: [
          { required: true, message: "请选择类型", trigger: ["blur", "change"] },
        ],
        seriesImg: [
          { required: true, message: "请选择NFT图片", trigger: ["blur", "change"] },
        ],
        reclaimRate: [
          { required: true, message: "请输入回收比例", trigger: ["blur", "change"] },
          { validator: validateRate, trigger: 'blur' }
        ],
      },
      chainList: chainList
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 加载列表
    async fetchNftPlatformList(isSearch = true) {
      const { size } = this;
      let _page = this.page;
      if (isSearch) {
        this.page = 1;
        _page = 1;
      }
      const data = {
        obscureField: this.obscureField,
        size: size,
        page: _page,
      };
      const res = await this.$http.getNftPlatformList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getNftExternalStatistics({
        obscureField: this.obscureField
      });
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    handleEdit(row) {
      this.ruleForm = {
        ...row
      }

      this.ruleForm.reclaimRate = new bigNumber(this.ruleForm.reclaimRate).multipliedBy(100).toString();
      this.operatingType = 2;
      this.showDialog = true;
    },
    // 删除
    handleDel(row) {
      this.$confirm(`确定要删除系列『${row.seriesName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = await this.$http.nftPlatformDel({
            id: row.id
          });
          if (res) {
            this.fetchNftPlatformList(true);
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
      this.operatingType = 1;
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
          let ruleForm = { ...this.ruleForm };
          if (this.operatingType == 1) {
            if (this.fileImg.length == 0) {
              this.$message.error("请上传图片！");
              return;
            }
            ruleForm.seriesImg = this.fileImg[0].url;
          }
          ruleForm.reclaimRate = new bigNumber(ruleForm.reclaimRate).dividedBy(100);
          let res = null;
          if (!ruleForm.id) {
            res = await this.$http.nftPlatformAdd({ ...ruleForm });
          } else {
            res = await this.$http.nftPlatformUpdate({ ...ruleForm });
          }

          if (res) {
            this.handleClose();
            this.fetchNftPlatformList();
            this.$refs["ruleForm"].resetFields();
            this.$message.success("操作成功！");
            this.fileImg = [];
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchNftPlatformList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchNftPlatformList(false);
    },
  },
  // 创建后
  created() {
    this.fetchNftPlatformList();
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
