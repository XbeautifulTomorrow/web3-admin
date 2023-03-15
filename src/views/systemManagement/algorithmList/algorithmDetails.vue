<template>
  <el-dialog
    :title="
      detailsData
        ? $t('algorithm.editingAlgorithms')
        : $t('algorithm.addAlgorithms')
    "
    :visible.sync="popupDialog"
    width="400px"
    :before-close="closePopup"
    class="public-dialog"
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
      <el-form-item
        v-if="detailsData"
        :label="`${$t('algorithm.algorithmId')}:`"
      >
        <span>{{ formData.id }}</span>
      </el-form-item>
      <el-form-item
        :label="`${$t('algorithm.algorithmName')}:`"
        prop="algorithmName"
      >
        <el-input v-model="formData.algorithmName" :maxlength="30" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('algorithm.coinIds')}:`" prop="coinIds">
        <el-select
          :placeholder="`${$t('public.select')}${$t('currency.currency')}`"
          v-model="formData.coinIds"
          filterable
          multiple
          class="public-hundredPercent"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.coinName"
            :value="item.id"
          >
          </el-option>
        </el-select>
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
  name: 'AlgorithmDetails',
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
    const coinIdsRegex = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error(this.$t('algorithm.coinIdsMust')));
      }
      callback();
    };
    return {
      url: '',
      imgName: '',
      fileList: [],
      formData: {
        id: '',
        algorithmName: '',
        coinIds: [],
      },
      options: [],
      rules: {
        algorithmName: [
          {
            required: true,
            message: this.$t('algorithm.algorithmNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        coinIds: [{ validator: coinIdsRegex, trigger: ['blur', 'change'] }],
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
            const res = await this.$http.algorithmBaseUpdate(formData);
            if (res) {
              const { detailsData } = this;
              this.$message.success(
                this.$t('public.updateSuc').replace(
                  /{name}/,
                  detailsData.algorithmName
                )
              );
              this.closePopup(true);
            }
          } else {
            delete formData.id;
            const res = await this.$http.algorithmBaseAdd(formData);
            if (res) {
              this.$message.success(this.$t('public.addSuc'));
              this.closePopup(true);
            }
          }
        }
      });
    },
    async coinConfigFindListApi() {
      // coinName 币种名称
      // contractAddress 合约地址
      const res = await this.$http.coinConfigFindList();
      if (res) {
        this.options = res;
        this.initializationCoinIdsFun();
      }
    },
    initializationFun() {
      const { detailsData } = this;
      if (detailsData) {
        const { id, algorithmName } = detailsData;
        this.formData = {
          id,
          algorithmName,
          coinIds: [],
        };
      }
    },
    initializationCoinIdsFun() {
      const { detailsData } = this;
      if (detailsData) {
        const { coins } = detailsData;
        let _coins = [];
        coins.forEach((item) => {
          _coins.push(item.id);
        });
        this.formData.coinIds = _coins;
      }
    },
  },
  // 创建后
  created() {
    this.coinConfigFindListApi();
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
