<template>
  <el-dialog
    :title="
      detailsData
        ? $t('miningSoftware.updateMiningSoftware')
        : $t('miningSoftware.addMiningSoftware')
    "
    :visible.sync="popupDialog"
    width="550px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="left"
      :label-width="labelWidth"
      :model="formData"
      :rules="rules"
      class="public-form miningSoftware-details"
      ref="currencyForm"
    >
      <el-form-item
        v-if="detailsData"
        :label="`${$t('farmList.id')}:`"
        prop="coinName"
        :label-width="labelWidth"
      >
        <span>{{ detailsData.id }}</span>
      </el-form-item>
      <el-form-item
        :label="`${$t('miningSoftware.name')}:`"
        prop="name"
        :label-width="labelWidth"
      >
        <el-input v-model="formData.name" clearable />
      </el-form-item>
      <el-form-item
        :label="`${$t('miningSoftware.graphicsCard')}:`"
        prop="graphicsCard"
        :label-width="labelWidth"
      >
        <el-checkbox-group v-model="formData.graphicsCard" size="medium">
          <el-checkbox-button
            v-for="(card, index) in graphicsCard"
            :label="card"
            :key="`card-${index}`"
          >
            {{ card }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <!-- 算法 -->
      <div
        v-for="(coinAlgorithm, index) in formData.softwareCoins"
        :key="`coin-algorithm-${index}`"
        class="coin-algorithm"
      >
        <el-form-item
          :label="`${$t('miningSoftware.softwareCoins')}:`"
          :prop="'softwareCoins.' + index + '.coinId'"
          :label-width="labelWidth"
          :rules="coinIdRules"
        >
          <el-select
            popper-class="coin-algorithm-select"
            v-model="formData.softwareCoins[index].coinId"
            filterable
            :placeholder="`${$t('public.select')}${$t('currency.currency')}`"
            @change="changeCoinIdFun"
          >
            <el-option
              v-for="item in coinList"
              :key="item.id"
              :label="item.coinName"
              :value="item.coinName"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- disabled -->
        <el-form-item
          :label="`${$t('currency.algNumber')}:`"
          :prop="'softwareCoins.' + index + '.algName'"
          class="algorithm-list"
          label-width="50px"
          :rules="algNameRules"
        >
          <el-input v-model="formData.softwareCoins[index].algName" clearable />
          <!-- <el-select
            v-model="formData.softwareCoins[index].algName"
            filterable
            :placeholder="`${$t('public.select')}${$t('currency.algNumber')}`"
            :disabled="!algorithmList[formData.softwareCoins[index].coinId]"
          >
            <el-option
              v-for="item in algorithmList[
                formData.softwareCoins[index].coinId
              ]"
              :key="item.id"
              :label="item.algorithmName"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <i
          v-if="formData.softwareCoins.length > 1"
          class="el-icon-delete cursor"
          @click="deleteCoinAlgFun(index)"
        ></i>
      </div>
      <div class="coinAlg-add" :style="{ marginLeft: labelWidth }">
        <el-button
          v-if="formData.softwareCoins.length < coinConfigFindList.length"
          type="primary"
          @click="addCoinAlgFun"
          class="coinAlg-add-button"
        >
          {{ $t('miningSoftware.add') }}
        </el-button>
      </div>
      <!-- 软件版本 -->
      <div class="name-addres">
        <p class="software-version">
          {{ $t('miningSoftware.softwareVersions') }}
        </p>
        <div
          v-for="(softwareVersions, index) in formData.softwareVersions"
          :key="`name-addres-${index}`"
          class="coin-algorithm"
        >
          <el-form-item
            :prop="'softwareVersions.' + index + '.version'"
            label-width="0"
            class="name-input"
            :style="{ width: `200px` }"
            :rules="versionRules"
          >
            <el-input
              v-model="formData.softwareVersions[index].version"
              clearable
            />
          </el-form-item>
          <el-form-item
            label-width="0"
            class="addres-input"
            :error="errorFile[index] ? $t('miningSoftware.fileMust') : ''"
            v-loading="loading[index]"
          >
            <div
              class="addres-downloadPath"
              v-if="
                detailsData &&
                  formData.softwareVersions[index].downloadPath &&
                  fileList[index].length < 1
              "
            >
              <span>
                {{ formData.softwareVersions[index].downloadPath }}
              </span>
              <el-upload
                :class="['again-upload']"
                :action="origin"
                :headers="headers"
                :data="{
                  softwareName: formData.name,
                  version: formData.softwareVersions[index].version,
                }"
                :limit="2"
                :on-change="changeFun"
                :on-success="successFun"
                :on-error="errorFun"
                :on-progress="progressFun"
                :file-list="fileList[index]"
                ref="upload"
                multiple
              >
                <el-button
                  :disabled="
                    !(formData.name && formData.softwareVersions[index].version)
                  "
                  size="small"
                  type="primary"
                  @click="uploadFun(index)"
                >
                  {{ $t('miningSoftware.uploadAgain') }}
                </el-button>
              </el-upload>
            </div>
            <template v-else>
              <el-upload
                :class="[
                  'public-upload public-search',
                  {
                    'upload-big': fileList[index].length < 1,
                  },
                ]"
                :action="origin"
                :headers="headers"
                :data="{
                  softwareName: formData.name,
                  version: formData.softwareVersions[index].version,
                }"
                :limit="2"
                :on-change="changeFun"
                :on-success="successFun"
                :on-error="errorFun"
                :on-progress="progressFun"
                :file-list="fileList[index]"
                ref="upload"
                multiple
              >
                <el-button
                  :disabled="
                    !(formData.name && formData.softwareVersions[index].version)
                  "
                  size="small"
                  type="primary"
                  @click="uploadFun(index)"
                >
                  {{
                    fileList[index].length > 0
                      ? $t('miningSoftware.uploadAgain')
                      : $t('miningSoftware.uploadMiningSoftware')
                  }}
                </el-button>
              </el-upload>
            </template>
          </el-form-item>
          <i
            v-if="formData.softwareVersions.length > 1"
            class="el-icon-delete cursor"
            @click="deleteSoftwareVersionVOSFun(index)"
          ></i>
        </div>
        <div class="coinAlg-add" :style="{ marginLeft: labelWidth }">
          <el-button
            type="primary"
            @click="addSoftwareVersionVOSFun"
            class="coinAlg-add-button"
          >
            {{ $t('miningSoftware.add') }}
          </el-button>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="addMiningSoftware">
        {{ detailsData ? $t('public.save') : $t('public.sure') }}
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
    detailsData: {
      type: Object,
    },
  },
  // 模板引入
  components: {},
  // 数据
  data() {
    const cardsRegex = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error(this.$t('miningSoftware.graphicsCardMust')));
      }
      callback();
    };
    return {
      loading: [],
      uploadIndex: '',
      fileList: [],
      errorFile: [],
      labelWidth: '120px',
      graphicsCard: ['AMD', 'NVIDIA'],
      coinList: [],
      coinConfigFindList: [],
      algorithmList: {},
      softwareCoins: {
        coinId: '', //币种id
        algName: '', //算法名称
      },
      softwareVersions: {
        downloadPath: '', //下载地址
        version: '', //版本地址
      },
      formData: {
        name: '', //挖矿软件名称
        graphicsCard: [], //挖矿软件显卡(多个用逗号隔开)
        softwareCoins: [],
        softwareVersions: [],
      },
      options: [],
      coinIdRules: [
        {
          required: true,
          message: this.$t('miningSoftware.softwareCoinsMust'),
          trigger: ['blur', 'change'],
        },
      ],
      algNameRules: [
        {
          required: true,
          message: this.$t('miningSoftware.algNameMustW'),
          trigger: ['blur', 'change'],
        },
      ],
      versionRules: [
        {
          required: true,
          message: this.$t('miningSoftware.softwareVersionsMust'),
          trigger: ['blur', 'change'],
        },
      ],
      // downloadPathRules: [
      //   {
      //     required: true,
      //     message: this.$t('miningSoftware.downloadPathMust'),
      //     trigger: ['blur', 'change'],
      //   },
      // ],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('miningSoftware.nameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        graphicsCard: [{ validator: cardsRegex, trigger: ['blur', 'change'] }],
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
      this.$emit('closePopup', isApi);
    },
    uploadFun(index) {
      this.uploadIndex = index;
    },
    progressFun() {
      const { uploadIndex } = this;
      this.$set(this.loading, uploadIndex, true);
    },
    changeFun(file, _fileList) {
      const { uploadIndex, fileList } = this;
      if (fileList[uploadIndex].length > 1) {
        this.$refs.upload[uploadIndex].clearFiles();
      }
      this.$set(this.errorFile, uploadIndex, false);
      this.$set(this.fileList, uploadIndex, [file]);
      const { name } = file;
      const _downloadPath = name.split('.');
      this.formData.softwareVersions[uploadIndex].downloadPath =
        _downloadPath[0];
    },
    // uploadSoftwareApi() {
    //   // this.$refs['uploadForm'].validate((valid) => {
    //   //   if (valid) {
    //   //     if (this.errorFile || this.fileList.length < 1) {
    //   //       return;
    //   //     }
    //   //     this.loading = true;
    //   //     this.$refs.upload.submit();
    //   //   }
    //   // });
    //   const { formData } = this;
    //   const { softwareVersions } = formData;
    //   softwareVersions.forEach((item, index) => {
    //     this.$refs.upload[index].submit();
    //   });
    // },
    successFun() {
      // if (res && res.data) {
      //   this.$message.success(this.$t('miningSoftware.uploadSoftwareOtherSuc'));
      // } else {
      //   this.$message.success(this.$t('miningSoftware.uploadSoftwareSuc'));
      // }
      const { uploadIndex } = this;
      this.$set(this.loading, uploadIndex, false);
      this.$message.success(this.$t('miningSoftware.uploadSoftwareSuc'));
      // this.closePopup(true);
    },
    errorFun() {
      const { uploadIndex } = this;
      this.$set(this.loading, uploadIndex, false);
      this.$message.error(this.$t('miningSoftware.uploadSoftwareError'));
    },
    addCoinAlgFun() {
      this.formData.softwareCoins.push(Object.copyArrObj(this.softwareCoins));
    },
    deleteCoinAlgFun(index) {
      if (this.formData.softwareCoins.length < 2) return;
      this.formData.softwareCoins.splice(index, 1);

      this.initializationCoinFun();
    },
    addSoftwareVersionVOSFun() {
      this.formData.softwareVersions.push(
        Object.copyArrObj(this.softwareVersions)
      );
      this.fileList.push([]);
      this.errorFile.push(false);
    },
    deleteSoftwareVersionVOSFun(index) {
      if (this.formData.softwareVersions.length < 2) return;
      this.fileList.splice(index, 1);
      this.errorFile.splice(index, 1);
      this.formData.softwareVersions.splice(index, 1);
    },
    changeCoinIdFun(algorithmName) {
      // this.algorithmBaseFindListApi(algorithmName);
      this.initializationCoinFun();
    },
    initializationCoinFun(data = Object.copyArrObj(this.coinConfigFindList)) {
      const { softwareCoins } = this.formData;
      const _data = Object.copyArrObj(data);
      let isHaveArr = [];
      softwareCoins.forEach((item) => {
        isHaveArr.push(item.coinId);
      });
      _data.forEach((item) => {
        if (isHaveArr.includes(item.coinName)) {
          item.disabled = true;
        }
      });
      this.coinList = _data;
    },
    async coinConfigFindListApi() {
      // coinName 币种名称
      // contractAddress 合约地址
      const res = await this.$http.coinConfigFindList();
      if (res) {
        this.coinConfigFindList = res;
        this.initializationCoinFun(res);
      }
    },
    async algorithmBaseFindListApi(coin) {
      if (this.algorithmList[coin]) return;
      const res = await this.$http.algorithmBaseFindList({ coin });
      if (res && res.length > 0) {
        this.algorithmList = Object.assign({}, this.algorithmList, {
          [coin]: res,
        });
      }
    },
    addMiningSoftware() {
      const { fileList } = this;
      let isError = false;
      fileList.forEach((item, index) => {
        if (item.length < 1) {
          this.$set(this.errorFile, index, true);
          isError = true;
        }
      });
      this.$refs['currencyForm'].validate(async (valid) => {
        if (valid && !isError) {
          const { formData, detailsData, coinConfigFindList } = this;
          const { coinId, algName, version, graphicsCard, ...other } = formData;
          let data = Object.copyArrObj(other);
          data.graphicsCard = '';
          graphicsCard.forEach((item) => {
            data.graphicsCard += item + ',';
          });
          const { softwareCoins } = data;
          softwareCoins.forEach((item) => {
            const { coinId } = item;
            const idArr = coinConfigFindList.filter(
              (item) => item.coinName === coinId
            );
            if (idArr.length > 0) {
              item.coinId = idArr[0].id;
            }
          });
          if (detailsData) {
            data.id = detailsData.id;
            const res = await this.$http.miningSoftwareEnableUpdate(data);
            if (res) {
              this.$message.success(
                this.$t('public.updateSuc').replace(/{name}/, detailsData.name)
              );
              this.closePopup(true);
            }
          } else {
            const res = await this.$http.miningSoftwareEnableAdd(data);
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
          graphicsCard,
          softwareCoinVOS,
          softwareVersionVOS,
          name,
        } = detailsData;
        this.formData.name = name;
        let _graphicsCard = [];
        if (graphicsCard) {
          _graphicsCard = graphicsCard.split(',').filter((item) => item);
        }
        if (softwareCoinVOS && softwareCoinVOS.length > 0) {
          const softwareCoinVOSArr = softwareCoinVOS.filter(
            (item) => item.coinConfigVO && item.coinConfigVO.coinName
          );
          if (softwareCoinVOSArr.length < 1) {
            this.addCoinAlgFun();
          } else {
            softwareCoinVOS.forEach((item) => {
              const { coinConfigVO, algName } = item;
              if (coinConfigVO && coinConfigVO.coinName) {
                this.formData.softwareCoins.push({
                  algName: algName,
                  coinId: coinConfigVO.coinName,
                });
                this.algorithmBaseFindListApi(coinConfigVO.coinName);
              }
            });
          }
        } else {
          this.addCoinAlgFun();
        }
        if (softwareVersionVOS && softwareVersionVOS.length > 0) {
          this.formData.softwareVersions = softwareVersionVOS;
          softwareVersionVOS.forEach(() => {
            this.fileList.push([]);
            this.loading.push(false);
          });
        } else {
          this.addSoftwareVersionVOSFun();
        }
        this.formData.graphicsCard = _graphicsCard;
      } else {
        this.addCoinAlgFun();
        this.addSoftwareVersionVOSFun();
      }
    },
  },
  // 创建后
  created() {
    this.initializationFun();
    this.coinConfigFindListApi();
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
.public-upload {
  padding-right: 5px;
}
.addres-downloadPath {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
}
.again-upload {
  width: 20%;
}
</style>

<style lang="scss">
.miningSoftware-details {
  .el-form-item {
    padding-right: 20px;
  }
  .public-upload {
    position: relative;
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;
  }
  .again-upload {
    .el-upload {
      float: none;
      width: 100%;
    }
  }
  .el-upload {
    float: right;
    width: 20%;
    margin-bottom: 0;
  }
  .upload-big {
    .el-upload,
    .el-button {
      width: 100%;
    }
  }
  .el-upload-list {
    float: left;
    max-width: 70%;
  }
  .el-upload-list__item {
    padding-right: 20px;
  }
  .el-upload-list__item:first-child {
    margin-top: 0;
  }
  .el-upload-list__item-name {
    margin-right: 0;
  }
  .el-upload-list__item:hover {
    .el-icon-close {
      display: none;
    }
  }
  .el-icon-close {
    display: none;
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
