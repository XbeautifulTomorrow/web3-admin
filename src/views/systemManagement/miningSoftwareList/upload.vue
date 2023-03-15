<template>
  <el-dialog
    :title="$t('miningSoftware.uploadMiningSoftware')"
    :visible.sync="popupDialog"
    width="550px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
    v-loading="loading"
  >
    <el-form
      label-position="left"
      :label-width="labelWidth"
      :model="formData"
      :rules="rules"
      class="public-form miningSoftware-details"
      ref="uploadForm"
    >
      <el-form-item
        :label="`${$t('miningSoftware.softwareName')}:`"
        prop="softwareName"
        :label-width="labelWidth"
      >
        <el-input v-model="formData.softwareName" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('miningSoftware.softwareVersions')}:`"
        prop="version"
        :label-width="labelWidth"
      >
        <el-input v-model="formData.version" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('miningSoftware.file')}:`"
        :label-width="labelWidth"
        :error="errorFile ? $t('miningSoftware.fileMust') : ''"
      >
        <el-upload
          class="public-upload public-search"
          :action="origin"
          :headers="headers"
          :data="formData"
          :limit="2"
          :auto-upload="false"
          :on-change="changeFun"
          :on-success="successFun"
          :on-error="errorFun"
          :file-list="fileList"
          ref="upload"
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            {{ $t('miningSoftware.dragFile') }}
            <em> {{ $t('miningSoftware.clickUpload') }}</em>
          </div>
          <!-- <div class="el-upload__tip" slot="tip">
            {{ $t('miningSoftware.justXslx') }}
          </div> -->
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="uploadSoftwareApi">
        {{ $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MiningSoftwareDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
  },
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      labelWidth: '100px',
      fileList: [],
      localFile: {},
      errorFile: false,
      loading: false,
      formData: {
        softwareName: '',
        version: '',
      },
      rules: {
        softwareName: [
          {
            required: true,
            message: this.$t('miningSoftware.softwareNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        version: [
          {
            required: true,
            message: this.$t('miningSoftware.softwareVersionsMust'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      origin:
        window.location.origin.indexOf('localhost') > -1
          ? 'http://221.236.31.34:13082/operation-web-admin/upload/software'
          : window.location.origin + '/operation-web-admin/upload/software',
      headers: { certificate: sessionStorage.getItem('token') },
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.loading = false;
      this.$emit('closePopup', isApi);
    },
    changeFun(file) {
      this.$refs.upload.clearFiles();
      this.fileList = [file];
      this.errorFile = false;
    },
    uploadSoftwareApi() {
      if (this.errorFile || this.fileList.length < 1) {
        this.errorFile = true;
      }
      this.$refs['uploadForm'].validate((valid) => {
        if (valid) {
          if (this.errorFile || this.fileList.length < 1) {
            return;
          }
          this.loading = true;
          this.$refs.upload.submit();
        }
      });
    },
    successFun(res) {
      // if (res && res.data) {
      //   this.$message.success(this.$t('miningSoftware.uploadSoftwareOtherSuc'));
      // } else {
      //   this.$message.success(this.$t('miningSoftware.uploadSoftwareSuc'));
      // }
      this.$message.success(this.$t('miningSoftware.uploadSoftwareSuc'));
      this.closePopup(true);
    },
    errorFun() {
      this.loading = false;
      this.$message.error(this.$t('miningSoftware.uploadSoftwareError'));
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.coin-algorithm {
  display: flex;
  position: relative;
}
.algorithm-list {
  margin-left: 10px;
  box-sizing: border-box;
}
.el-icon-delete {
  position: absolute;
  top: 15px;
  right: -5px;
}
.coinAlg-add-button {
  width: calc(100% - 20px);
}
.name-addres {
  margin-top: 20px;
}
.software-version {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
.miningSoftware-details {
  .el-form-item {
    padding-right: 20px;
  }
}
.coin-algorithm {
  .el-form-item {
    width: 50%;
  }
  .name-input {
    .el-input__inner {
      padding-left: 5px;
    }
  }
  .addres-input {
    flex: 1;
    margin-left: 20px;
  }
}
.coin-algorithm-select {
  .is-disabled {
    display: none;
  }
}
</style>
