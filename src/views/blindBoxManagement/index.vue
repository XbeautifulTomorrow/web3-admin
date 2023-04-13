<template>
  <div class="page-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 140px;" placeholder="输入盲盒ID" v-model="Id" clearable />
      <el-input class="public-input" style="width: 140px;" placeholder="输入盲盒名称" v-model="boxName" clearable />
      <el-select v-model="externalStatus" class="public-select-box" popper-class="public-select-box" placeholder="外部状态"
        clearable>
        <el-option label="正常" value="NORMAL">
        </el-option>
        <el-option label="数量不足" value="NUMBER">
        </el-option>
      </el-select>
      <el-select v-model="boxStatus" class="public-select-box" popper-class="public-select-box" placeholder="盲盒状态"
        clearable>
        <el-option label="冻结" value="DISABLE">
        </el-option>
        <el-option label="正常" value="NORMAL">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="fetchBoxManagerList()">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="addBox()">
        添加盲盒
      </el-button>
    </div>
    <div class="remittance-box">
      <div class="remittance-amount remittance-more">
        <div class="remittance-item">
          <div class="title">总盲盒数</div>
          <div class="val">{{ baseUserPage && baseUserPage.total }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总被开次数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.openBoxNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总价值</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.priceTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总提走次数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.outNumberTotal }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总退款数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.refundsTotalNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总收入次数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.grossIncomeNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总支出数</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.totalExpenditureNumber }}</div>
        </div>
        <div class="remittance-item">
          <div class="title">总收益</div>
          <div class="val">{{ aggregateQuery && aggregateQuery.grossIncomeU }}</div>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="盲盒ID" align="center" key="1">
      </el-table-column>
      <el-table-column prop="boxImg" label="盲盒图片" width="120px" align="center" key="2">
        <template slot-scope="scope">
          <div style="width: 100px; height: 100px">
            <el-image style="height: 100%;" :src="scope.row.boxImg" :preview-src-list="[scope.row.boxImg]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="boxName" width="120" label="盲盒名称" align="center" key="3">
      </el-table-column>
      <el-table-column prop="boxIndex" label="推荐顺序" align="center" key="4">
      </el-table-column>
      <el-table-column prop="sales" label="内容" align="center" key="5">
      </el-table-column>
      <el-table-column prop="price" label="单价" align="center" key="6">
      </el-table-column>
      <el-table-column prop="fivePrice" label="五连价格" align="center" key="7"></el-table-column>
      <el-table-column prop="tenPrice" label="十连价格" align="center" key="8"></el-table-column>
      <el-table-column prop="totalWeight" label="总权重" align="center" key="9"></el-table-column>
      <el-table-column prop="sales" width="100" :label="`销量(${coin})`" align="center" key="10"></el-table-column>
      <el-table-column prop="grossIncome" width="100" :label="`总收入(${coin})`" align="center" key="11"></el-table-column>
      <el-table-column prop="totalExpenditure" width="100" :label="`总支出(${coin})`" align="center"
        key="12"></el-table-column>
      <el-table-column prop="totalProfit" width="100" :label="`总利润(${coin})`" align="center" key="13"></el-table-column>
      <el-table-column prop="pastTraPrice" width="100" label="实际返还率" align="center" key="14">
        <template slot-scope="scope">
          {{ `${new bigNumber(actualReturn(scope.row) || 0).multipliedBy(100).toFixed(2)}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="deviseRate" width="100" label="设计返还率" align="center" key="15">
        <template slot-scope="scope">
          {{ `${new bigNumber(scope.row.deviseRate || 0).multipliedBy(100).toFixed(2)}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="expectRate" width="100" label="期望返还率" align="center" key="16">
        <template slot-scope="scope">
          {{ `${new bigNumber(scope.row.expectRate || 0).multipliedBy(100).toFixed(2)}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="openNumber" width="120" label="抽奖返还率（以十连抽为准）" align="center" key="17">
        <template slot-scope="scope">
          {{ `${new bigNumber(paybackRate(scope.row) || 0).multipliedBy(100).toFixed(2)}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="externalStatus" label="外部异常" align="center" key="18">
        <template slot-scope="scope">
          <span style="color: #EC5706;" v-if="scope.row.externalStatus == 'NUMBER'">数量不足</span>
          <span style="color: #21AE04;" v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column prop="boxStatus" label="状态" align="center" key="19">
        <template slot-scope="scope">
          <span style="color: #EC5706;" v-if="scope.row.boxStatus == 'DISABLE'">冻结</span>
          <span style="color: #21AE04;" v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="110" key="20" fixed="right">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor" @click="onEbit(scope.row)">
            编辑
          </span>
          <span class="blueColor publick-button cursor"
            :style="`color: ${scope.row.boxStatus == 'DISABLE' ? '#09a9ff' : 'red'}`" @click="operatingNft(scope.row)">
            {{ scope.row.boxStatus == 'DISABLE' ? '解禁' : '冻结' }}
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
    <el-dialog title="新增盲盒" :visible.sync="showDialog" width="1200px" :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="box-setting">
        <el-form ref="ruleForm" class="add-form" :rules="rules" :model="ruleForm" label-width="130px">
          <el-form-item label="盲盒名称" prop="boxName">
            <el-input v-model="ruleForm.boxName" style="width: 300px" placeholder="请输入盲盒名称">
            </el-input>
          </el-form-item>
          <el-form-item label="盲盒图片" prop="seriesImg">
            <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileImg" :multiple="false" :limit="1"
              accept="image/png,image/jpg,image/jpeg" list-type="picture-card" :before-upload="handleBefore"
              :on-remove="handleRemove" :on-exceed="handExceed" :headers="uploadHeader">
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
          <el-form-item label="推荐顺序" prop="boxIndex">
            <el-input type="number" v-model.number="ruleForm.boxIndex" style="width: 300px"
              placeholder="请输入推荐顺序"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input type="number" v-model="ruleForm.price" style="width: 300px" placeholder="请输入单价"></el-input>
          </el-form-item>
          <el-form-item label="五连价格" prop="fivePrice">
            <el-input type="number" v-model="ruleForm.fivePrice" style="width: 300px" placeholder="请输入五连价格"></el-input>
          </el-form-item>
          <el-form-item label="十连价格" prop="tenPrice">
            <el-input type="number" v-model="ruleForm.tenPrice" style="width: 300px" placeholder="请输入十连价格"></el-input>
          </el-form-item>
          <el-form-item label="设计返还率" prop="deviseRate">
            <el-input type="number" v-model="ruleForm.deviseRate" style="width: 300px" placeholder="请输入设计返还率">
              <template slot="append">%</template></el-input>
          </el-form-item>
          <el-form-item label="传奇数量" prop="legendNum">
            <el-input type="number" v-model="ruleForm.legendNum" style="width: 300px" placeholder="请输入传奇数量">
              <template slot="append">几率%</template></el-input>
          </el-form-item>
          <el-form-item label="史诗数量" prop="epicNum">
            <el-input type="number" v-model="ruleForm.epicNum" style="width: 300px" placeholder="请输入史诗数量">
              <template slot="append">几率%</template></el-input>
          </el-form-item>
          <el-form-item label="稀有数量" prop="rareNum">
            <el-input type="number" v-model="ruleForm.rareNum" style="width: 300px" placeholder="请输入稀有数量">
              <template slot="append">几率%</template></el-input>
          </el-form-item>
          <el-form-item label="普通数量">
            <el-input type="number" readonly="readonly" v-model="ruleForm.common" style="width: 300px" placeholder="普通数量">
              <template slot="append">几率%</template></el-input>
          </el-form-item>
          <el-form-item label="盲盒描述">
            <el-input type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入描述"
              v-model="ruleForm.boxDesc"></el-input>
          </el-form-item>
        </el-form>
        <div class="nft-box">
          <div class="external-nft nft-item">
            <div class="operating-box">
              <div class="title">外部NFT配置</div>
              <div class="btn">
                <div class="add" @click="addSeries(1)">添加</div>
              </div>
            </div>
            <el-table :data="externalList" style="min-width: 0;" class="public-table">
              <el-table-column prop="seriesName" label="系列" align="center" key="1" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="chain" label="链" align="center" key="2">
              </el-table-column>
              <el-table-column prop="number" label="数量" width="120px" align="center" key="3">
                <template slot-scope="scope">
                  <div class="number-box">
                    <el-input type="number" class="number" v-model.number="scope.row.number"></el-input>
                    <el-tooltip class="item" effect="dark" content="该NFT当前最大只能设置为XX个" placement="top-start">
                      <i v-if="scope.row.realNumber && Number(scope.row.realNumber || 0) < Number(scope.row.number || 0)"
                        class="icon-warning el-icon-warning-outline"></i>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="floorPrice" label="均价" align="center" key="4">
              </el-table-column>
              <el-table-column prop="boxImg" label="总价" align="center" key="5">
                <template slot-scope="scope">
                  {{ new bigNumber(scope.row.floorPrice).multipliedBy(scope.row.number || 0).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="几率" align="center" key="6">
                <template slot-scope="scope">
                  {{ probability(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column prop="id" align="center" width="60" key="7" fixed="right">
                <template slot-scope="scope">
                  <img style="width: 24px;" @click="handleNftDel(scope.row, scope.$index, 1)"
                    src="@/assets/images/icon_delete.svg" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="external-nft nft-item">
            <div class="operating-box">
              <div class="title">内部NFT配置</div>
              <div class="btn">
                <img src="@/assets/images/icon_calculator.svg" />
                <div class="add" @click="addSeries(2)">添加</div>
              </div>
            </div>
            <el-table :data="platformList" style="min-width: 0;" class="public-table">
              <el-table-column prop="id" align="center" key="1">
                <template slot-scope="scope">
                  <div style="display: flex;align-items: center;">
                    <img v-if="scope.row.baseStatus == 'TRUE'" src="@/assets/images/icon_benchmark_active.svg" alt="">
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="seriesName" label="系列" align="center" key="2">
              </el-table-column>
              <el-table-column prop="price" label="单价" align="center" key="3">
              </el-table-column>
              <el-table-column prop="multipleRate" label="基准系数" align="center" key="4">
              </el-table-column>
              <el-table-column prop="number" label="数量" align="center" key="5">
                <template slot-scope="scope">
                  {{ scope.row.number && new bigNumber(scope.row.number || 0).multipliedBy(scope.row.multipleRate ||
                    0).toFixed(0) || "--" }}
                </template>
              </el-table-column>
              <el-table-column label="总价" align="center" key="6">
                <template slot-scope="scope">
                  {{ new bigNumber(scope.row.price).multipliedBy(scope.row.number || 1).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="几率" align="center" key="7">
                <template slot-scope="scope">
                  {{ probability(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column prop="id" align="center" width="120" key="20" fixed="right">
                <template slot-scope="scope">
                  <img style="width: 24px;margin-right: 10px;" @click="ebitSeries(scope.row)"
                    src="@/assets/images/icon_ebit.svg" />
                  <img style="width: 24px;" @click="handleNftDel(scope.row, scope.$index, 2)"
                    src="@/assets/images/icon_delete.svg" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
      <el-dialog width="400px" :close-on-click-modal="false" :title="seriesType == 1 ? '选择外部NFT' : '选择内部NFT'"
        :visible.sync="showSeriesDialog" append-to-body :before-close="handleSeriesClose">
        <el-form ref="seriesForm" class="add-form" :model="seriesForm" label-width="80px">
          <div class="benchmark-obx" v-if="seriesType == 2">
            <img v-if="!platformList.length > 0" src="@/assets/images/icon_benchmark_active.svg" alt="" srcset="">
            <img v-else-if="seriesForm.baseStatus == 'TRUE'" @click="seriesForm.baseStatus = 'FALSE'"
              src="@/assets/images/icon_benchmark_active.svg" alt="" srcset="">
            <img v-else src="@/assets/images/icon_benchmark.svg" @click="seriesForm.baseStatus = 'TRUE'" alt="" srcset="">
            <span>基准NFT</span>
          </div>
          <el-form-item label="选择链" v-if="seriesType == 1" prop="adjust">
            <el-select style="width: 260px;" v-model="seriesForm.chain" popper-class="public-select-box"
              placeholder="请选择">
              <el-option label="ETH" value="ETH" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择系列" prop="adjust">
            <el-select style="width: 260px;" v-model="seriesForm.seriesId" popper-class="public-select-box"
              @change="changeSeries" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in downNft" :key="index" :label="item.seriesName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="地板价" v-if="seriesType == 1" prop="adjust">
            <el-input style="width: 260px;" type="number" readonly v-model="seriesForm.floorPrice">
              <template slot="append">{{ coin }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="单价" v-if="seriesType == 2" prop="adjust">
            <el-input style="width: 260px;" type="number" readonly v-model="seriesForm.price">
              <template slot="append">{{ coin }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="基准倍率" v-if="seriesType == 2 && seriesForm.baseStatus == 'FALSE'" prop="adjust">
            <el-input style="width: 260px;" type="number" v-model="seriesForm.multipleRate"
              placeholder="请输入基准倍率"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleSeriesClose()">取 消</el-button>
          <el-button type="primary" @click="pushSeries()">确 定</el-button>
        </span>
      </el-dialog>
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
  name: 'BlindBoxManagement',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      Id: null, // NFT Id
      boxName: null, // 系列名
      externalStatus: null, // 异常状态
      boxStatus: null, // 盲盒状态
      page: 1,
      size: 20,
      tableData: [],
      baseUserPage: null,
      aggregateQuery: {},

      /** 添加盲盒相关 */
      showDialog: false,
      uploadUrl: "",
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      fileImg: [],
      ruleForm: {
        boxName: null, //盲盒名称
        boxImg: null, //盲盒图片
        boxIndex: null, //推荐顺序
        price: null, //价格
        coin: "ETH", //币种
        fivePrice: null, //五连价格
        tenPrice: null, //十连价格
        deviseRate: null, //设计返还率
        legendNum: null, //传奇数量
        epicNum: null, //史诗数量
        rareNum: null, //稀有数量
        boxDesc: null, //盲盒描述
        platformList: [],
        externalList: []
      },
      chainList: chainList,
      rules: {
        boxName: [
          { required: true, message: "请输入盲盒名称", trigger: ["blur", "change"] },
        ],
        boxImg: [
          { required: true, message: "请选择盲盒图片", trigger: ["blur", "change"] },
        ],
        boxIndex: [
          { required: true, message: "请输入推荐顺序", trigger: ["blur", "change"] },
        ],
        price: [
          { required: true, message: "请输入价格", trigger: ["blur", "change"] },
        ],
        coin: "ETH", //币种
        fivePrice: [
          { required: true, message: "请输入五连价格", trigger: ["blur", "change"] },
        ],
        tenPrice: [
          { required: true, message: "请输入十连价格", trigger: ["blur", "change"] },
        ],
        deviseRate: [
          { required: true, message: "请输入设计返还率", trigger: ["blur", "change"] },
        ],
        legendNum: [
          { required: true, message: "请输入传奇数量", trigger: ["blur", "change"] },
        ],
        epicNum: [
          { required: true, message: "请输入史诗数量", trigger: ["blur", "change"] },
        ],
        rareNum: [
          { required: true, message: "请输入稀有数量", trigger: ["blur", "change"] },
        ]
      },
      externalData: [],
      platformData: [],
      externalList: [],
      platformList: [],

      /** 选择系列相关 */
      showSeriesDialog: false,
      seriesType: 1,
      isEbit: false,
      seriesForm: {
        chain: "ETH",
        seriesId: null,
        seriesName: null,
        floorPrice: null,
        price: null,
        multipleRate: null,
        baseStatus: "FALSE"
      },
      downNft: null
    };
  },
  mixins: [pagination],
  // 方法
  methods: {
    bigNumber: bigNumber,
    timeForStr: timeForStr,
    // 搜索条件
    searchFun() {
      return {
        id: this.Id, // 盲盒Id
        boxName: this.boxName, // 盲盒名
        externalStatus: this.externalStatus,
        boxStatus: this.boxStatus
      };
    },
    // 加载列表
    async fetchBoxManagerList(isSearch = true) {
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
      const res = await this.$http.getBoxManagerList(data);
      if (res) {
        this.baseUserPage = res;
        this.tableData = res.records;
      }

      delete data.size;
      delete data.page;
      const resAggregateQuery = await this.$http.getBoxManagerStatistics(data);
      if (resAggregateQuery) {
        this.aggregateQuery = resAggregateQuery;
      }
    },
    // 加载外部NFT
    async fetchNftExternalList() {
      const data = {
        coin: this.coin,
        userType: this.userType,
        page: 1,
        size: 999
      };
      const res = await this.$http.getNftExternalList(data);
      if (res) {
        this.downNft = res.records;
        this.externalData = res.records;
      }
    },
    // 加载内部NFT
    async fetchNftPlatformList() {
      const data = {
        coin: this.coin,
        userType: this.userType,
        page: 1,
        size: 999
      };
      const res = await this.$http.getNftPlatformList(data);
      if (res) {
        this.downNft = res.records;
        this.platformData = res.records;
      }
    },
    // 冻结/解禁
    operatingNft(row) {
      this.$confirm(`确定要${row.boxStatus == 'DISABLE' ? '开启' : '关闭'}『${row.boxName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = null;
          if (row.boxStatus == 'DISABLE') {
            // 开启
            res = await this.$http.boxManagerThaw({
              id: row.id
            });
          } else {
            // 关闭
            res = await this.$http.boxManagerFreeze({
              id: row.id
            });
          }
          if (res) {
            this.fetchBoxManagerList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 删除
    handleDel(event) {
      this.$confirm(`确定要删除盲盒『${row.boxName || row.id}』吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          let res = await this.$http.boxManagerDelete({
            id: row.id
          });
          if (res) {
            this.fetchBoxManagerList();
            this.$message.success("操作成功");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    actualReturn(row) {
      const { totalExpenditure, adjust, grossIncome } = row;
      const expenditure = new bigNumber(totalExpenditure || 0).plus(adjust);
      if (!grossIncome) return 0;
      return new bigNumber(expenditure || 0).dividedBy(grossIncome);
    },
    // 抽奖返还率
    paybackRate(row) {
      const { expectRate } = row;
      const expectRates = new bigNumber(expectRate || 0).multipliedBy(expectRate);
      const actualReturnVal = this.actualReturn(row);
      if (!actualReturnVal) return 0;
      return new bigNumber(expectRates || 0).dividedBy(actualReturnVal);
    },
    addBox() {
      this.showDialog = true;
    },
    // 编辑中奖修正
    onEbit(row) {
      this.ruleForm.adjust = row.adjust;
      this.ruleForm.id = row.id;
      this.showDialog = true;
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
          let res = await this.$http.boxManagerWinningRevision({ ...ruleForm });

          if (res) {
            this.handleClose();
            this.fetchBoxManagerList();
            this.$refs["ruleForm"].resetFields();
            this.$message.success("操作成功！");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加Nft系列
    addSeries(type) {
      this.seriesType = type;
      if (!this.platformList.length > 0) {
        this.seriesForm.baseStatus = "TRUE";
      }

      if (this.seriesType == 1) {
        this.fetchNftExternalList();
      } else {
        this.fetchNftPlatformList();
      }
      this.isEbit = false;
      this.showSeriesDialog = true;
    },
    ebitSeries(event) {
      this.seriesForm = {
        ...event
      }
      this.fetchNftPlatformList();

      this.isEbit = true;
      this.showSeriesDialog = true;
    },
    // NFT系列变动
    changeSeries(event) {
      const nftInfo = this.downNft.find(e => e.id == event)
      this.seriesForm.floorPrice = nftInfo && nftInfo.floorPrice || null;
      this.seriesForm.price = nftInfo && nftInfo.price || null;
      this.seriesForm.seriesName = nftInfo && nftInfo.seriesName || null;
    },
    pushSeries() {
      if (this.seriesType == 1) {
        if (this.externalList.findIndex(e => e.seriesId == this.seriesForm.seriesId) > -1) {
          this.$message.warning("该NFT系列已存在");
          return
        }

        this.externalList.push(this.seriesForm);
      } else {
        if (this.seriesForm.baseStatus == "FALSE" && !this.seriesForm.multipleRate) {
          this.$message.warning("请输入基准倍率");
          return
        }

        if (!this.isEbit && this.platformList.findIndex(e => e.seriesId == this.seriesForm.seriesId) > -1) {
          this.$message.warning("该NFT系列已存在");
          return
        }

        if (this.seriesForm.baseStatus == "TRUE") {
          this.seriesForm.multipleRate = 1;
        }
        if (this.isEbit) {
          const index = this.platformList.findIndex(e => e.seriesId == this.seriesForm.seriesId);
          this.platformList[index] = this.seriesForm;
          const platform = this.platformList;
          this.platformList = [];

          setTimeout(() => {
            this.platformList = platform;
          }, 10);
        } else {
          this.platformList.push(this.seriesForm);
          if (this.seriesForm.baseStatus == "TRUE" && this.platformList.length > 1) {
            for (let i = 0; i < this.platformList.length; i++) {
              const element = this.platformList[i];
              if (element.seriesId == this.seriesForm.seriesId) {
                this.platformList[i].baseStatus = "TRUE";
              } else {
                this.platformList[i].baseStatus = "FALSE";
              }
            }

            const platform = this.platformList;
            this.platformList = [];

            setTimeout(() => {
              this.platformList = platform;
            }, 10);
          }
        }

      }

      this.$forceUpdate();
      this.handleSeriesClose();
    },
    /**
     * @description 计算抽奖概率
     */
    probability(event) {
      const nftData = this.platformList.concat(this.externalList);
      let nftNumber = 0;
      nftData.forEach(element => {
        nftNumber += element.number || 0;
      });

      if (!event.number && !nftNumber) {
        return "--"
      }

      return `${new bigNumber(event.number || 0).dividedBy(nftNumber || 0).multipliedBy(100).toFixed(4)}%`;
    },
    // 删除NFT
    handleNftDel(row, index, type) {
      if (type == 1) {
        this.externalList.splice(index, 1);
      } else {
        this.platformList.splice(index, 1);
      }
    },
    /** 选择系列关闭 */
    handleSeriesClose(done) {
      if (done) {
        done()
        return
      }
      this.seriesForm = {
        chain: "ETH",
        seriesId: null,
        seriesName: null,
        floorPrice: null,
        price: null,
        multipleRate: null,
        baseStatus: "FALSE"
      }

      this.showSeriesDialog = false
    },
    handleClose(done) {
      this.ruleForm = {
        boxName: null, //盲盒名称
        boxImg: null, //盲盒图片
        boxIndex: null, //推荐顺序
        price: null, //价格
        coin: "ETH", //币种
        fivePrice: null, //五连价格
        tenPrice: null, //十连价格
        deviseRate: null, //设计返还率
        legendNum: null, //传奇数量
        epicNum: null, //史诗数量
        rareNum: null, //稀有数量
        boxDesc: null, //盲盒描述
        platformList: [],
        externalList: []
      };

      this.$forceUpdate();

      setTimeout(() => {
        this.$refs["ruleForm"].clearValidate();
      }, 10);

      if (done) {
        done()
        return
      }
      this.showDialog = false;
    },
    handleSizeChange(val) {
      this.size = val;
      this.fetchBoxManagerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchBoxManagerList(false);
    },
  },
  // 创建后
  created() {
    this.fetchBoxManagerList();
    this.uploadUrl = config.api + "/file/upload/image";
  },
  computed: {
    coin() {
      return this.$store.getters.coinConfig;
    },
    userType() {
      return this.$store.getters.accountConfig;
    }
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

.box-setting {
  display: flex;
}

.nft-box {
  padding-left: 20px;
  flex: 1;
}

.nft-item+.nft-item {
  padding-top: 20px;
}

.nft-item {
  min-height: 336px;
}


.operating-box {
  border-radius: 10px 10px 0 0;
  height: 40px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E5E5E5;

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }

  .btn {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;

    .add {
      width: 140px;
      height: 40px;
      background-color: #169BD5;
      line-height: 40px;
      color: #fff;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
    }

    img {
      height: 30px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}

.number-box {
  display: flex;
  align-items: center;

  /deep/ .el-input__inner {
    text-align: center;
  }

  .icon-warning {
    width: 24px;
    font-size: 24px;
    color: red;
    margin-left: 4px;
  }
}

.benchmark-obx {
  padding-bottom: 22px;
  display: flex;
  align-items: center;

  img {
    width: 30px;
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
