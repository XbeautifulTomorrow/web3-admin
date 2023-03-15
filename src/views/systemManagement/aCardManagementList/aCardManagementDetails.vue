<template>
  <el-dialog
    :title="
      detailsData
        ? $t('aCardManagement.createDefaultFrequencyUpdate')
        : $t('aCardManagement.createDefaultFrequency')
    "
    :visible.sync="popupDialog"
    width="650px"
    :before-close="closePopup"
    class="public-dialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="top"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="public-form"
      ref="currencyForm"
    >
      <el-form-item
        :label="`${$t('graphicsCardList.graphicsCardName')}:`"
        :prop="detailsData ? '' : 'graphicsCardName'"
      >
        <el-input v-model="formData.graphicsCardName" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('overclock.coreClockOffset')}:`"
        :prop="detailsData ? '' : 'coreClockOffset'"
      >
        <el-input
          type="number"
          v-model.number="formData.coreClockOffset"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('overclock.coreVoltage')}:`"
        :prop="detailsData ? '' : 'coreVoltage'"
      >
        <el-input
          type="number"
          v-model.number="formData.coreVoltage"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('overclock.memoryFrequency')}:`"
        :prop="detailsData ? '' : 'memoryFrequency'"
      >
        <el-input
          type="number"
          v-model.number="formData.memoryFrequency"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('overclock.powerLimit')}:`"
        :prop="detailsData ? '' : 'powerLimit'"
      >
        <el-input
          type="number"
          v-model.number="formData.powerLimit"
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="`${$t('overclock.fan')}:`"
        :prop="detailsData ? '' : 'fan'"
      >
        <el-input type="number" v-model.number="formData.fan" clearable />
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
  name: 'ACardManagementDetails',
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
      url: '',
      imgName: '',
      fileList: [],
      formData: {
        id: '',
        graphicsCardName: '',
        coreClockOffset: '',
        coreVoltage: '',
        memoryFrequency: '',
        powerLimit: '',
        fan: '',
      },
      options: [],
      rules: {
        graphicsCardName: [
          {
            required: true,
            message: this.$t('graphicsCardList.graphicsCardNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        coreClockOffset: [
          {
            required: true,
            message: this.$t('overclock.coreClockOffsetMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('overclock.coreClockOffsetMust'),
            trigger: ['blur', 'change'],
          },
        ],
        coreVoltage: [
          {
            required: true,
            message: this.$t('overclock.coreVoltageMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('overclock.coreVoltageMust'),
            trigger: ['blur', 'change'],
          },
        ],
        memoryFrequency: [
          {
            required: true,
            message: this.$t('overclock.memoryFrequencyMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('overclock.memoryFrequencyMust'),
            trigger: ['blur', 'change'],
          },
        ],
        powerLimit: [
          {
            required: true,
            message: this.$t('overclock.powerLimitMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('overclock.powerLimitMust'),
            trigger: ['blur', 'change'],
          },
        ],
        fan: [
          {
            required: true,
            message: this.$t('overclock.fanMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('overclock.fanMust'),
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
          const { detailsData, formData } = this;
          if (detailsData) {
            const res = await this.$http.defaultCardConfigUpdate(formData);
            if (res) {
              const { detailsData } = this;
              this.$message.success(
                this.$t('public.updateSuc').replace(
                  /{name}/,
                  detailsData.graphicsCardName
                )
              );
              this.closePopup(true);
            }
          } else {
            delete formData.id;
            const res = await this.$http.defaultCardConfigAdd(formData);
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
          id,
          graphicsCardName,
          coreClockOffset,
          coreVoltage,
          memoryFrequency,
          powerLimit,
          fan,
        } = detailsData;
        this.formData = {
          id,
          graphicsCardName,
          coreClockOffset,
          coreVoltage,
          memoryFrequency,
          powerLimit,
          fan,
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

<style lang="scss" scoped></style>
