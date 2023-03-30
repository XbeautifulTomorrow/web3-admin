<template>
  <div class="user-list-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入ID、名称" v-model="accountInfo" clearable />
      <el-input class="public-input" style="width: 120px;" placeholder="输入项目方" v-model="accountInfo" clearable />
      <el-select class="public-input" v-model="accountInfo" style="width: 120px">
        <el-option label="全部状态" value="ETH" />
        <el-option label="待审核" value="ETH" />
        <el-option label="未通过" value="ETH" />
        <el-option label="售卖中" value="ETH" />
        <el-option label="已出售" value="ETH" />
        <el-option label="已下架" value="ETH" />
      </el-select>
      <div class="public-date-box">
        <span class="demonstration">
          添加时间
        </span>
        <el-date-picker v-model="registrationTime" type="daterange" range-separator="到" start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="onSearch()">
        查询
      </el-button>
      <el-button type="primary" icon="el-icon-download" class="public-search" @click="showDialog = true">
        创建NFT
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="系列ID" align="center" key="1">
      </el-table-column>
      <el-table-column prop="id" label="系列图" align="center" key="2">
      </el-table-column>
      <el-table-column prop="id" label="系列名" align="center" key="3">
      </el-table-column>
      <el-table-column prop="id" label="合约" align="center" key="4">
      </el-table-column>

      <el-table-column prop="id" label="项目方" align="center" key="5">
      </el-table-column>
      <el-table-column prop="id" label="市场" align="center" key="6">
      </el-table-column>
      <el-table-column prop="id" label="所在链" align="center" key="7">
      </el-table-column>
      <el-table-column prop="id" label="发行数量" align="center" key="8">
      </el-table-column>
      <el-table-column prop="id" label="可入盒数量" align="center" key="9">
      </el-table-column>
      <el-table-column prop="id" label="地板价(ETH)" align="center" key="10">
      </el-table-column>
      <el-table-column prop="id" label="发行时间" align="center" key="11">
      </el-table-column>
      <el-table-column prop="id" label="关联盲盒" align="center" key="12">
      </el-table-column>
      <el-table-column prop="id" label="添加时间" align="center" key="13">
      </el-table-column>
      <el-table-column prop="id" label="上次刷新" align="center" key="14">
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" key="15">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor">
            详情
          </span>
          <span class="blueColor publick-button cursor">
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
        <el-form-item label="系列名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="合约地址" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="系列图片" prop="name">
          <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileExcel" :multiple="false" :limit="1"
            accept=".xls,.xlsx" list-type="picture-card" :before-upload="handleBefore"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-exceed="handExceed"
            :headers="uploadHeader" :data="{ imageType: 'coinImage' }">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所在链" prop="name">
          <el-select v-model="ruleForm.isShow" style="width: 300px">
            <el-option label="ETH" value="ETH" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择市场" prop="name">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="关键字" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="项目方" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="发行总量" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="抓取数量" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px" placeholder="请输入名称" />
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
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  name: 'PlatformNftSeries',
  // 模板引入
  components: {
  },
  // 数据
  data() {
    return {
      showDialog: false,
      accountInfo: "",
      Id: "",
      userStatus: "-1",
      registrationTime: null,
      loginedTime: null,
      tableData: null,
      baseUserPage: null,
      uploadUrl: "",
      fileExcel: [],
      uploadHeader: {
        certificate: sessionStorage.getItem("token"),
      },
      ruleForm: {},
      rules: {},
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    };
  },
  // 方法
  methods: {
    onSearch() { },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleClose(done) {
      if (done) {
        done()
        return
      }

      this.showDialog = false
    },
    handleUpload(res) {
      if (res.status == 200) {
        this.fileImg.push({ url: res.data });
        return;
      }
      this.$message.error("上传失败");
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
    handleSizeChange(val) {
      this.size = val;
      this.baseUserPageApi();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.baseUserPageApi(false);
    },
  },
  // 创建后
  created() { },
  // 挂载后
  mounted() { },
  // 更新后
  updated() { },
  // 销毁
  beforeDestroy() { },
};
</script>

<style lang="scss" scoped></style>
