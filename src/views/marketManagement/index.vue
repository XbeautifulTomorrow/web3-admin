<template>
  <div class="user-list-wrapper">
    <div class="public-list-inputs">
      <el-input class="public-input" style="width: 220px;" placeholder="输入ID、名称" v-model="accountInfo" clearable />
      <el-input class="public-input" style="width: 220px;" placeholder="输入市场名称" v-model="accountInfo" clearable />
      <el-select v-model="userStatus" class="public-select-box" popper-class="public-select-box" placeholder="全部状态"
        clearable>
        <el-option label="全部状态" value="-1">
        </el-option>
        <el-option label="封停" value="0">
        </el-option>
        <el-option label="正常" value="1">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" class="public-search" @click="onSearch()">
        查询
      </el-button>
    </div>
    <div style="margin-bottom: 10px;">
      <span>总市场数：000</span>
    </div>
    <el-table :data="tableData" style="width: 100%" class="public-table" border>
      <el-table-column prop="id" label="市场ID" align="center" key="1">
      </el-table-column>
      <el-table-column prop="id" label="市场名称" align="center" key="2">
      </el-table-column>
      <el-table-column prop="id" label="所在链" align="center" key="3">
      </el-table-column>
      <el-table-column prop="id" label="合约" align="center" key="4">
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="110" key="17">
        <template slot-scope="scope">
          <span class="blueColor publick-button cursor">
            冻结
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="baseUserPage && baseUserPage.total" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="pagination.pageSizes" :page-size="size"
      layout=" sizes, prev, pager, next, jumper" :total="baseUserPage.total" class="public-pagination">
    </el-pagination>
    <el-dialog v-if="showDialog" title="导入" :visible.sync="showDialog" width="440px" :close-on-click-modal="false"
      :before-close="handleClose">
      <el-upload :action="uploadUrl" :on-success="handleUpload" :file-list="fileExcel" :multiple="false" :limit="1"
        accept=".xls,.xlsx" list-type="picture-card" :before-upload="handleBefore" :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove" :on-exceed="handExceed" :headers="uploadHeader" :data="{ imageType: 'coinImage' }">
        <i class="el-icon-plus" />
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
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
    };
  },
  // 方法
  methods: {
    onSearch() { },
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
