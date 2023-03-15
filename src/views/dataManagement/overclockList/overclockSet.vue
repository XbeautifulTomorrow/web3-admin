<template>
  <div class="overclockSet">
    <!-- AMD -->
    <el-form
      v-if="!cardSwitch && amdCardData"
      label-position="top"
      label-width="100px"
      :model="amdCardData"
      class="public-form overclock-form overclock-form-amd"
      ref="amdForm"
    >
      <!-- 算法 -->
      <el-form-item
        :label="`${$t('currency.algNumber')}:`"
        v-if="amdCardData.algorithmId"
      >
        <el-select
          v-model="amdCardData.algorithmId"
          filterable
          placeholder=""
          class="overclock-select"
          disabled
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
        v-if="nvidiaCardData && amdCardData"
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
          disabled
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
            :placeholder="0"
            type="number"
            v-model.number="amdCardData[item.key]"
            clearable
            disabled
          />
        </template>
      </el-form-item>
      <div
        v-for="(templateAmdTweak, tweakIndex) in amdCardData.templateAmdTweaks"
        :key="`templateAmdTweak-${tweakIndex}`"
        class="el-form-item"
      >
        <el-form-item :label="`${$t('overclock.gpuIndex')}:`">
          <el-input
            :placeholder="0"
            type="number"
            v-model.number="amdCardData.templateAmdTweaks[tweakIndex].gpuIndex"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item :label="`${$t('overclock.socVddmax')}:`">
          <el-input
            :placeholder="0"
            type="number"
            v-model.number="amdCardData.templateAmdTweaks[tweakIndex].socVddmax"
            clearable
            disabled
          />
        </el-form-item>
      </div>
      <!-- <el-button @click="addAmdTweaksFun">
        {{ $t('overclock.addConfig') }}
      </el-button> -->
    </el-form>
    <!-- NVIDIA -->
    <el-form
      v-if="nvidiaCardData && cardSwitch"
      label-position="top"
      label-width="100px"
      :model="nvidiaCardData"
      class="public-form overclock-form overclock-form-nvidia"
      ref="nvidiaForm"
    >
      <!-- 算法 -->
      <el-form-item
        :label="`${$t('currency.algNumber')}:`"
        v-if="nvidiaCardData.algorithmId"
      >
        <el-select
          v-model="nvidiaCardData.algorithmId"
          filterable
          placeholder=""
          class="overclock-select"
          disabled
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
        v-if="nvidiaCardData && amdCardData"
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
          disabled
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
            :placeholder="0"
            type="number"
            v-model.number="nvidiaCardData[item.key]"
            clearable
            disabled
          />
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  cupAform,
  cupNform,
  templateAmdTweaks,
  isCheckbox,
} from './defaultOverclock';
export default {
  name: 'OverclockPresetsDetails',
  props: {
    amdCardData: {
      type: Object,
    },
    nvidiaCardData: {
      type: Object,
    },
    algorithmList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      cardSwitch: false,
      cupAform: cupAform,
      cupNform: cupNform,
      isCheckbox: isCheckbox,
    };
  },
  computed: {},
  // 方法
  methods: {
    // addAmdTweaksFun() {
    //   this.amdCardData.templateAmdTweaks.push(
    //     Object.copyArrObj(templateAmdTweaks)
    //   );
    // },
    // initializationAlgorithmIDFun() {
    //   const { algorithmId } = this;
    //   if (algorithmId) {
    //     this.amdCardData.algorithmId = algorithmId;
    //     this.nvidiaCardData.algorithmId = algorithmId;
    //   }
    // },
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
