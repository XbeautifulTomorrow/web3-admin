<template>
  <el-dialog
    :title="
      detailsData ? $t('orePool.updateOrePool') : $t('orePool.addOrePool')
    "
    :visible.sync="popupDialog"
    width="400px"
    :before-close="closePopup"
    class="public-dialog orePool-details"
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
        :label-width="labelWidth"
      >
        <span>{{ formData.id }}</span>
      </el-form-item>
      <el-form-item
        :label="`${$t('orePool.poolName')}:`"
        prop="poolName"
        :label-width="labelWidth"
      >
        <el-input v-model="formData.poolName" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('algorithm.coinIds')}:`"
        prop="coinIds"
        :label-width="labelWidth"
      >
        <el-select
          v-model="formData.coinIds"
          filterable
          multiple
          :placeholder="`${$t('public.select')}${$t('currency.currency')}`"
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
      <p class="url-text">{{ $t('orePool.url') }}</p>
      <div
        v-for="(servers, index) in formData.servers"
        :key="`name-addres-${index}`"
        class="coin-algorithm"
      >
        <el-form-item
          label-width="0"
          :prop="'servers.' + index + '.serverName'"
          class="name-input"
          :style="{ width: `${parseFloat(labelWidth) - 20}px` }"
          :rules="detailsData ? [] : serverNameRules"
        >
          <el-input v-model="formData.servers[index].serverName" clearable />
        </el-form-item>
        <el-form-item
          :prop="'servers.' + index + '.serverUrl'"
          label-width="0"
          class="addres-input"
          :rules="detailsData ? [] : serverUrlRules"
        >
          <el-input v-model="formData.servers[index].serverUrl" clearable />
        </el-form-item>
        <i
          v-if="formData.servers.length > 1"
          class="el-icon-delete cursor"
          @click="deleteServersFun(index)"
        ></i>
      </div>
      <div class="coinAlg-add" :style="{ marginLeft: labelWidth }">
        <el-button
          type="primary"
          @click="addServersFun"
          class="coinAlg-add-button"
        >
          {{ $t('miningSoftware.add') }}
        </el-button>
      </div>
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
  name: 'OrePoolDetails',
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
    const coinRegex = (rule, value, callback) => {
      if (this.detailsData) {
        callback();
      }
      const valueArr = value.filter((item) => item);
      if (value.length < 1 || valueArr.length < 1) {
        callback(new Error(this.$t('miningSoftware.softwareCoinsMust')));
      }
      callback();
    };
    return {
      labelWidth: '120px',
      url: '',
      imgName: '',
      fileList: [],
      servers: {
        serverName: '',
        serverUrl: '',
      },
      formData: {
        id: '',
        poolName: '',
        coinIds: [],
        servers: [],
      },
      options: [],
      serverNameRules: [
        {
          required: true,
          message: this.$t('orePool.serverUrlMust'),
          trigger: ['blur', 'change'],
        },
      ],
      serverUrlRules: [
        {
          required: true,
          message: this.$t('orePool.serverUrlMust'),
          trigger: ['blur', 'change'],
        },
      ],
      rules: {
        poolName: [
          {
            required: this.detailsData ? false : true,
            message: this.$t('orePool.poolNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        coinIds: [{ validator: coinRegex, trigger: ['blur', 'change'] }],
      },
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    deleteServersFun(index) {
      if (this.formData.servers.length < 1) return;
      this.formData.servers.splice(index, 1);
    },
    addServersFun() {
      this.formData.servers.push(Object.copyArrObj(this.servers));
    },
    addCurrency() {
      this.$refs['currencyForm'].validate(async (valid) => {
        if (valid) {
          const { detailsData, formData } = this;
          if (detailsData) {
            const res = await this.$http.orePoolUpdate(formData);
            if (res) {
              const { detailsData } = this;
              this.$message.success(
                this.$t('public.updateSuc').replace(
                  /{name}/,
                  detailsData.poolName
                )
              );
              this.closePopup(true);
            }
          } else {
            delete formData.id;
            const res = await this.$http.orePoolAdd(formData);
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
        const { id, poolName, orePoolServers } = detailsData;
        let servers = [];
        orePoolServers.forEach((item) => {
          const { serverName, serverUrl } = item;
          servers.push({
            serverName,
            serverUrl,
          });
        });
        this.formData = {
          id,
          poolName,
          coinIds: [],
          servers,
        };
      } else {
        this.formData.servers = [Object.copyArrObj(this.servers)];
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

<style lang="scss" scoped>
.coin-algorithm {
  display: flex;
  position: relative;
}
.addres-input {
  flex: 1;
  margin-left: 20px;
}
.url-text {
  margin-bottom: 20px;
}
.el-icon-delete {
  position: absolute;
  top: 15px;
  right: -5px;
}
.coinAlg-add-button {
  width: calc(100% - 20px);
}
</style>
<style lang="scss">
.orePool-details {
  .el-form-item {
    padding-right: 20px;
  }
}
.coin-algorithm {
  .name-input {
    .el-input__inner {
      padding-left: 5px;
    }
  }
}
</style>
