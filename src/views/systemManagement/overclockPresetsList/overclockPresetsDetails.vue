<template>
  <el-dialog
    :title="
      detailsData
        ? $t('overclockPresets.updateOverclockingPreset')
        : $t('overclockPresets.createOverclockingPreset')
    "
    :visible.sync="popupDialog"
    width="650px"
    :before-close="closePopup"
    class="public-dialog overclock-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <!-- AMD -->
    <el-form
      v-if="!cardSwitch"
      label-position="top"
      label-width="100px"
      :model="amdCardData"
      class="public-form overclock-form-amd"
      ref="amdForm"
    >
      <!-- 名称 -->
      <el-form-item
        :label="`${$t('overclockPresets.graphicsCardName')}:`"
        :error="
          error.graphicsCardNameA
            ? $t('graphicsCardList.graphicsCardNameMust')
            : ''
        "
      >
        <el-input
          v-model="amdCardData.graphicsCardName"
          @input="rulesFun('graphicsCardName')"
          @blur="rulesFun('graphicsCardName')"
          clearable
        />
      </el-form-item>
      <!-- 显存 -->
      <el-form-item
        :label="`${$t('graphicsCardList.graphicsCardMemory')}:`"
        :error="
          error.graphicsCardMemoryA
            ? $t('graphicsCardList.graphicsCardMemoryMust')
            : ''
        "
      >
        <el-input
          v-model="amdCardData.graphicsCardMemory"
          @input="rulesFun('graphicsCardMemory')"
          @blur="rulesFun('graphicsCardMemory')"
          clearable
        />
      </el-form-item>
      <!-- 效率 -->
      <el-form-item
        :label="`${$t('overclock.efficiency')}:`"
        :error="error.efficiencyA ? $t('overclock.efficiencyErro') : ''"
      >
        <el-input
          type="number"
          v-model.number="amdCardData.efficiency"
          @input="rulesFun('efficiency')"
          @blur="rulesFun('efficiency')"
          :min="0"
          :max="100"
          clearable
        />
      </el-form-item>
      <!-- 基数 -->
      <el-form-item :label="`${$t('overclock.baseNumber')}:`">
        <el-input
          type="number"
          v-model.number="amdCardData.baseNumber"
          clearable
        />
      </el-form-item>
      <!-- 算法 -->
      <el-form-item
        :label="`${$t('currency.algNumber')}:`"
        :error="error.algorithmIdA ? $t('miningSoftware.algNameMust') : ''"
      >
        <el-select
          v-model="amdCardData.algorithmId"
          filterable
          :placeholder="`${$t('public.select')}${$t('currency.algNumber')}`"
          class="overclock-select"
          @input="rulesFun('algorithmId')"
        >
          <el-option
            v-for="item in algorithmList"
            :key="item.id"
            :label="item.algorithmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div
        v-if="!detailsData"
        :class="[
          'overclockSet-switch',
          { backgroundColorA: !cardSwitch },
          { backgroundColorN: cardSwitch },
        ]"
      >
        <p>{{ $t('overclock.craphicsCardType') }}</p>
        <div class="overclockSet-switch-content">
          <span :class="{ colorA: !cardSwitch }">AMD</span>
          <el-switch
            v-model="cardSwitch"
            active-color="#84bf40"
            inactive-color="#f36527"
            class="card-switch"
          />
          <span :class="{ colorN: cardSwitch }">NVIDIA</span>
        </div>
      </div>
      <el-form-item
        v-for="(item, index) in cupAform"
        :key="`cupA-${index}`"
        :label="isCheckbox.includes(item.key) ? '' : item.title"
        :error="
          item.key === 'coreState' && error.coreStateA
            ? $t('overclock.coreStateErro')
            : ''
        "
        @input="rulesFun(item.key)"
        @blur="rulesFun(item.key)"
        :min="1"
        :max="7"
        :class="[
          'overclock-item',
          {
            isCheckbox: isCheckbox.includes(item.key),
          },
        ]"
      >
        <el-checkbox
          v-if="isCheckbox.includes(item.key)"
          v-model="amdCardData[item.key]"
        >
          {{ item.title }}
        </el-checkbox>
        <template v-else>
          <p
            :for="amdCardData[item.key]"
            slot="label"
            class="overclock-item-label"
          >
            <span>
              {{ item.title }}
            </span>
            <el-tooltip
              v-if="item.tooltip"
              placement="bottom-start"
              :visible-arrow="false"
              popper-class="atooltip"
            >
              <div slot="content" v-html="item.tooltip"></div>
              <span class="tips_box">i</span>
            </el-tooltip>
          </p>
          <el-input
            :placeholder="item.tips"
            type="number"
            v-model.number="amdCardData[item.key]"
            clearable
          />
        </template>
      </el-form-item>
      <div
        v-for="(templateAmdTweak, tweakIndex) in amdCardData.templateAmdTweaks"
        :key="`templateAmdTweak-${tweakIndex}`"
        class="amd-templateAmdTweak"
      >
        <el-form-item :label="`${$t('overclock.gpuIndex')}:`">
          <el-input
            type="number"
            v-model.number="amdCardData.templateAmdTweaks[tweakIndex].gpuIndex"
            clearable
          />
        </el-form-item>
        <el-form-item :label="`${$t('overclock.socVddmax')}:`">
          <el-input
            type="number"
            v-model.number="amdCardData.templateAmdTweaks[tweakIndex].socVddmax"
            clearable
          />
        </el-form-item>
      </div>
      <el-button @click="addAmdTweaksFun">
        {{ $t('overclock.addConfig') }}
      </el-button>
    </el-form>
    <!-- NVIDIA -->
    <el-form
      v-if="cardSwitch"
      label-position="top"
      label-width="100px"
      :model="nvidiaCardData"
      class="public-form overclock-form overclock-form-nvidia"
      ref="nvidiaForm"
    >
      <!-- 名称 -->
      <el-form-item
        :label="`${$t('overclockPresets.graphicsCardName')}:`"
        :error="
          error.graphicsCardNameN
            ? $t('graphicsCardList.graphicsCardNameMust')
            : ''
        "
        @input="rulesFun('graphicsCardName', 'N')"
        @blur="rulesFun('graphicsCardName', 'N')"
      >
        <el-input v-model="nvidiaCardData.graphicsCardName" clearable />
      </el-form-item>
      <!-- 显存 -->
      <el-form-item
        :label="`${$t('graphicsCardList.graphicsCardMemory')}:`"
        :error="
          error.graphicsCardMemoryN
            ? $t('graphicsCardList.graphicsCardMemoryMust')
            : ''
        "
        @input="rulesFun('graphicsCardMemory', 'N')"
        @blur="rulesFun('graphicsCardMemory', 'N')"
      >
        <el-input v-model="nvidiaCardData.graphicsCardMemory" clearable />
      </el-form-item>
      <!-- 效率 -->
      <el-form-item
        :label="`${$t('overclock.efficiency')}:`"
        :error="error.efficiencyN ? $t('overclock.efficiencyErro') : ''"
        @input="rulesFun('efficiency', 'N')"
        @blur="rulesFun('efficiency', 'N')"
        :min="0"
        :max="100"
      >
        <el-input
          type="number"
          v-model.number="nvidiaCardData.efficiency"
          clearable
        />
      </el-form-item>
      <!-- 基数 -->
      <el-form-item :label="`${$t('overclock.baseNumber')}:`">
        <el-input
          type="number"
          v-model.number="nvidiaCardData.baseNumber"
          clearable
        />
      </el-form-item>
      <!-- 算法 -->
      <el-form-item
        :label="`${$t('currency.algNumber')}:`"
        :error="error.algorithmIdN ? $t('miningSoftware.algNameMust') : ''"
      >
        <el-select
          v-model="nvidiaCardData.algorithmId"
          filterable
          :placeholder="`${$t('public.select')}${$t('currency.algNumber')}`"
          @input="rulesFun('algorithmId', 'N')"
          class="overclock-select"
        >
          <el-option
            v-for="item in algorithmList"
            :key="item.id"
            :label="item.algorithmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div
        v-if="!detailsData"
        :class="[
          'overclockSet-switch',
          { backgroundColorA: !cardSwitch },
          { backgroundColorN: cardSwitch },
        ]"
      >
        <p>{{ $t('overclock.craphicsCardType') }}</p>
        <div class="overclockSet-switch-content">
          <span :class="{ colorA: !cardSwitch }">AMD</span>
          <el-switch
            v-model="cardSwitch"
            active-color="#84bf40"
            inactive-color="#f36527"
            class="card-switch"
          />
          <span :class="{ colorN: cardSwitch }">NVIDIA</span>
        </div>
      </div>
      <el-form-item
        v-for="(item, index) in cupNform"
        :key="`cupN-${index}`"
        :class="[
          'overclock-item',
          {
            isCheckbox: isCheckbox.includes(item.key),
          },
        ]"
      >
        <el-checkbox
          v-if="isCheckbox.includes(item.key)"
          v-model="nvidiaCardData[item.key]"
        >
          {{ item.title }}
        </el-checkbox>
        <template v-else>
          <p
            :for="nvidiaCardData[item.key]"
            slot="label"
            class="overclock-item-label"
          >
            <span>
              {{ item.title }}
            </span>
            <el-tooltip
              v-if="item.tooltip"
              placement="bottom-start"
              :visible-arrow="false"
              popper-class="atooltip"
            >
              <div slot="content" v-html="item.tooltip"></div>
              <span class="tips_box">i</span>
            </el-tooltip>
          </p>
          <el-input
            :placeholder="item.tips"
            type="number"
            v-model.number="nvidiaCardData[item.key]"
            clearable
          />
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="addTemplatePresetFun">
        {{ detailsData ? $t('public.save') : $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { other } from './defaultOverclock';
import {
  defaultOverclockAmd,
  defaultOverclockNvidia,
  templateAmdTweaks,
  cupAform,
  cupNform,
  isCheckbox,
  // rules,
} from '../../dataManagement/overclockList/defaultOverclock';
export default {
  name: 'OverclockPresetsDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    algorithmId: {
      type: [String, Number],
      default: '',
    },
    detailsData: Object,
    graphicsCard: {
      type: String,
      default: 'AMD',
    },
  },
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      algorithmList: [],
      cardSwitch: false,
      cupAform: cupAform,
      cupNform: cupNform,
      amdCardData: {
        ...Object.copyArrObj(other),
        ...Object.copyArrObj(defaultOverclockAmd),
      },
      nvidiaCardData: {
        ...Object.copyArrObj(other),
        ...Object.copyArrObj(defaultOverclockNvidia),
      },
      isCheckbox: isCheckbox,
      needRegex: [
        'graphicsCardName',
        'graphicsCardMemory',
        'algorithmId',
        'efficiency',
        'coreState',
      ],
      error: {
        graphicsCardNameA: false,
        graphicsCardNameN: false,
        graphicsCardMemoryA: false,
        graphicsCardMemoryN: false,
        algorithmIdA: false,
        algorithmIdN: false,
        efficiencyA: false,
        efficiencyN: false,
        coreStateA: false,
        coreStateN: false,
      },
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    addAmdTweaksFun() {
      this.amdCardData.templateAmdTweaks.push(
        Object.copyArrObj(templateAmdTweaks)
      );
    },
    rulesFun(key, cardName = 'A') {
      let isTrue = true;
      if (this.needRegex.includes(key)) {
        const { amdCardData, nvidiaCardData } = this;
        const _data = cardName === 'A' ? amdCardData : nvidiaCardData;
        const _value = _data[key];
        if (key === 'efficiency') {
          if (_value && (_value < 0 || _value > 100)) {
            this.error.efficiencyA = true;
            isTrue = false;
          } else {
            this.error.efficiencyA = false;
          }
        } else if (key === 'coreState') {
          if (_value && (_value < 1 || _value > 7)) {
            this.error.coreStateA = true;
            isTrue = false;
          } else {
            this.error.coreStateA = false;
          }
        } else {
          if (!_value) {
            isTrue = false;
            this.error[`${key}${cardName}`] = true;
          } else {
            this.error[`${key}${cardName}`] = false;
          }
        }
      }
      return isTrue;
    },
    async algorithmBaseFindListApi() {
      const res = await this.$http.algorithmBaseFindList();
      if (res && res.length > 0) {
        this.algorithmList = res;
        this.initializationAlgorithmIDFun();
      }
    },
    async addTemplatePresetFun() {
      const { amdCardData, nvidiaCardData, isCheckbox, detailsData } = this;
      let _amdData = Object.copyArrObj(amdCardData);
      let _nvidiaData = Object.copyArrObj(nvidiaCardData);
      for (let key in _amdData) {
        if (isCheckbox.includes(key)) {
          if (_amdData[key]) {
            _amdData[key] = 'OPEN';
          } else {
            _amdData[key] = 'CLOSE';
          }
        }
      }
      for (let key in _nvidiaData) {
        if (isCheckbox.includes(key)) {
          if (_nvidiaData[key]) {
            _nvidiaData[key] = 'OPEN';
          } else {
            _nvidiaData[key] = 'CLOSE';
          }
        }
      }
      if (detailsData) {
        const { graphicsCard } = this;
        let res = null;
        if (graphicsCard === 'AMD') {
          _amdData.id = detailsData.id;
          res = await this.$http.templatePresetAmdUpdate(_amdData);
        } else {
          _nvidiaData.id = detailsData.id;
          res = await this.$http.templatePresetNvidiaUpdate(_nvidiaData);
        }
        if (res) {
          this.$message.success(this.$t('overclock.presetUpdateSuc'));
          this.closePopup(true);
        }
      } else {
        let amdApi = false;
        let nvidiaApi = false;
        for (let key in _amdData) {
          if (key === 'templateAmdTweaks') {
            _amdData[key].forEach((item) => {
              const { gpuIndex, socVddmax } = item;
              if (gpuIndex || socVddmax) {
                amdApi = true;
                return;
              }
            });
            if (amdApi) break;
          } else if (!isCheckbox.includes(key) && _amdData[key]) {
            amdApi = true;
            break;
          }
        }
        for (let key in _nvidiaData) {
          if (!isCheckbox.includes(key) && _nvidiaData[key]) {
            nvidiaApi = true;
            break;
          }
        }
        let isTrueA = true;
        let isTrueN = true;
        for (let key in _amdData) {
          const isNull = this.rulesFun(key);
          if (!isNull) {
            isTrueA = false;
          }
        }
        for (let key in _nvidiaData) {
          const isNull = this.rulesFun(key, 'N');
          if (!isNull) {
            isTrueN = false;
          }
        }
        if (amdApi && isTrueA) {
          const res = await this.$http.templatePresetAmdAdd(_amdData);
          if (res) {
            this.$message.success(this.$t('overclock.presetAmdAddSuc'));
            if (!nvidiaApi) {
              this.closePopup(true);
            }
          }
        } else {
          this.cardSwitch = false;
        }
        if (nvidiaApi && isTrueN) {
          const res = await this.$http.templatePresetNvidiaAdd(_nvidiaData);
          if (res) {
            this.$message.success(this.$t('overclock.presetNvidiaAddSuc'));
            this.closePopup(true);
          }
        } else {
          if (isTrueA) {
            this.cardSwitch = true;
          }
        }
      }
    },
    initializationAlgorithmIDFun() {
      const { algorithmId } = this;
      if (algorithmId) {
        this.amdCardData.algorithmId = algorithmId;
        this.nvidiaCardData.algorithmId = algorithmId;
      }
    },
    initializationFun() {
      const {
        detailsData,
        graphicsCard,
        amdCardData,
        nvidiaCardData,
        isCheckbox,
      } = this;
      if (detailsData) {
        if (graphicsCard === 'AMD') {
          this.cardSwitch = false;
          for (let key in amdCardData) {
            if (isCheckbox.includes(key)) {
              if (detailsData[key] === 'OPEN') {
                amdCardData[key] = true;
              } else {
                amdCardData[key] = false;
              }
            } else if (detailsData[key]) {
              amdCardData[key] = detailsData[key];
            }
          }
        } else {
          this.cardSwitch = true;
          for (let key in nvidiaCardData) {
            if (isCheckbox.includes(key)) {
              if (detailsData[key] === 'OPEN') {
                nvidiaCardData[key] = true;
              } else {
                nvidiaCardData[key] = false;
              }
            } else if (detailsData[key]) {
              nvidiaCardData[key] = detailsData[key];
            }
          }
        }
      }
    },
  },
  // 创建后
  created() {
    this.algorithmBaseFindListApi();
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
.overclock-form {
  display: flex;
  flex-wrap: wrap;
}
.el-form-item {
  width: 100%;
}
.overclockSet-switch {
  border-radius: 8px;
  color: #7c8997;
  width: 180px;
  height: 80px;
  padding: 10px;
  font-weight: 600;
  margin-bottom: 20px;
}
.overclockSet-switch-content {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  margin-top: 10px;
}
.card-switch {
  margin: 0 10px;
}
.overclock-item-label {
  display: flex;
  align-items: center;
  align-content: center;
}
.tips_box {
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  margin-left: 6px;
  font-size: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4164e4;
  text-align: center;
  font-family: Sitka Banner;
  color: #000;
  font-weight: bold;
  vertical-align: 4px;
  cursor: pointer;
}
.isCheckbox {
  width: 50%;
}
.overclock-select {
  width: 100%;
}
</style>

<style lang="scss">
.overclock-form {
  .el-form-item__label {
    padding: 0;
  }
}
</style>
