<template>
  <el-dialog
    :title="
      detailsData
        ? $t('systemVersionManagement.systemVersionManagerUpdate')
        : $t('systemVersionManagement.systemVersionManagerAdd')
    "
    :visible.sync="popupDialog"
    width="650px"
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
    >
      <el-form-item v-if="detailsData" :label="`${$t('farmList.id')}:`">
        <span>{{ detailsData.id }}</span>
      </el-form-item>
      <el-form-item
        :label="`${$t('systemVersionManagement.systemVersion')}:`"
        prop="systemVersion"
      >
        <el-input v-model="formData.systemVersion" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('systemVersionManagement.downloadUrl')}:`"
        prop="downloadUrl"
      >
        <el-input v-model="formData.downloadUrl" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('systemVersionManagement.remark')}:`"
        prop="remark"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8 }"
          v-model="formData.remark"
        />
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
  name: 'SystemVersionManagementListDetails',
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
      formData: {
        id: '',
        systemVersion: '',
        remark: '',
        downloadUrl: '',
      },
      rules: {
        systemVersion: [
          {
            required: true,
            message: this.$t('systemVersionManagement.systemVersionMust'),
            trigger: ['blur', 'change'],
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t('systemVersionManagement.remarkMust'),
            trigger: ['blur', 'change'],
          },
        ],
        downloadUrl: [
          {
            required: true,
            message: this.$t('systemVersionManagement.downloadUrlMust'),
            trigger: ['blur', 'change'],
          },
        ],
      },
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
          if (detailsData) {
            const res = await this.$http.systemVersionManagerUpdate(formData);
            if (res) {
              this.$message.success(this.$t('public.updateSuc'));
              this.closePopup(true);
            }
          } else {
            delete formData.id;
            const res = await this.$http.systemVersionManagerAdd(formData);
            if (res) {
              this.$message.success(this.$t('public.addSuc'));
              this.closePopup(true);
            }
          }
        }
      });
    },
    initializationFun() {
      const { detailsData } = this;
      if (detailsData) {
        const {
          id = '',
          systemVersion = '',
          remark = '',
          downloadUrl = '',
        } = detailsData;
        this.formData = {
          id,
          systemVersion,
          remark,
          downloadUrl,
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
