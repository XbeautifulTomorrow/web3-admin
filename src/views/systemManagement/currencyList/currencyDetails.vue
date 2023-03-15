<template>
  <el-dialog
    :title="
      detailsData ? $t('currency.updateCurrency') : $t('currency.addCurrency')
    "
    :visible.sync="popupDialog"
    width="400px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="left"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="public-form"
      ref="currencyForm"
      v-loading="loading"
    >
      <el-form-item :label="`${$t('currency.coinName')}:`" prop="coinName">
        <el-input v-model="formData.coinName" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('currency.contractAddress')}:`"
        prop="contractAddress"
      >
        <el-input v-model="formData.contractAddress" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('currency.coinImage')}:`" prop="coinImage">
        <div class="upload-img">
          <el-upload
            class="upload-demo"
            :action="origin"
            :headers="headers"
            :file-list="fileList"
            :show-file-list="false"
            list-type="picture"
            ref="upload"
            :on-success="successFun"
            :on-error="errorFun"
            :on-progress="progressFun"
          >
            <el-tooltip
              slot="trigger"
              placement="bottom-start"
              :visible-arrow="false"
              popper-class="atooltip"
            >
              <div slot="content">{{ $t('currency.imageMemory') }}</div>
              <el-button size="small" type="primary">
                {{
                  formData.coinImage
                    ? $t('currency.changeImage')
                    : $t('currency.selectImage')
                }}
              </el-button>
            </el-tooltip>
            <div v-if="imgName" slot="tip" class="el-upload__tip">
              {{ $t('currency.selectedImage') + imgName }}
            </div>
          </el-upload>
          <div v-if="formData.coinImage" class="currency-icon">
            <img class="currency-icon-img" :src="formData.coinImage" alt="" />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="addCurrency">
        {{ detailsData ? $t('public.save') : $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CurrencyDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    detailsData: {
      type: Object,
    },
  },
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      loading: false,
      url: '',
      imgName: '',
      fileList: [],
      formData: {
        coinName: '',
        contractAddress: '',
        coinImage: '',
      },
      rules: {
        coinName: [
          {
            required: true,
            message: this.$t('currency.coinNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        contractAddress: [
          {
            required: true,
            message: this.$t('currency.contractAddressMust'),
            trigger: ['blur', 'change'],
          },
        ],
        coinImage: [
          {
            required: true,
            message: this.$t('currency.coinImageMust'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      origin:
        window.location.origin.indexOf('localhost') > -1
          ? 'http://221.236.31.34:13082/operation-web-admin/upload/image'
          : window.location.origin + '/operation-web-admin/upload/image',
      headers: { certificate: sessionStorage.getItem('token') },
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    addCurrency() {
      this.$refs['currencyForm'].validate(async (valid) => {
        if (valid) {
          const { formData, detailsData } = this;
          let _data = Object.copyArrObj(formData);
          if (detailsData) {
            _data.id = detailsData.id;
            _data.enableStatus = detailsData.enableStatus;
            const res = await this.$http.coinConfigUpdate(_data);
            if (res) {
              this.$message.success(
                this.$t('public.updateSuc').replace(/{name}/, '')
              );
              this.closePopup(true);
            }
          } else {
            const res = await this.$http.coinConfigAdd(_data);
            if (res) {
              this.$message.success(this.$t('public.addSuc'));
              this.closePopup(true);
            }
          }
        }
      });
    },
    progressFun() {
      this.loading = true;
    },
    successFun(res) {
      if (res.code === 200 && res.data) {
        this.loading = false;
        const { formData } = this;
        formData.coinImage = res.data;
      }
    },
    errorFun() {
      this.loading = false;
      this.$message.error(this.$t('aCardManagement.importError'));
    },
    initializationFun() {
      const { detailsData } = this;
      if (detailsData) {
        const {
          coinName = '',
          coinImage = '',
          contractAddress = '',
        } = detailsData;
        this.formData = {
          coinName,
          coinImage,
          contractAddress,
        };
      }
    },
  },
  // 创建后
  created() {
    this.initializationFun();
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
.upload-img {
  display: flex;
}
.currency-icon {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  margin-left: 10px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
.currency-icon-img {
  max-width: 50px;
  max-height: 50px;
}
.el-upload__tip {
  width: 100px;
  line-height: 14px;
}
</style>
