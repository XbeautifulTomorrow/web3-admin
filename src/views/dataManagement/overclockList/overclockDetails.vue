<template>
  <el-dialog
    :title="$t('userList.addPlayer2')"
    :visible.sync="popupDialog"
    width="650px"
    :before-close="closePopup"
    class="public-dialog overclock-list-dialog"
    :close-on-click-modal="false"
  >
    <el-tabs v-if="formOverclock" slot="title" v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in detailsData"
        :label="
          item.algorithmName
            ? item.algorithmName
            : $t('overclock.defaultStatus')
        "
        :name="`${index}`"
        :key="`detailsData-${index}`"
      >
        <overclockSet
          v-if="formOverclock[Number(activeName)]"
          :amdCardData="formOverclock[Number(activeName)][0]"
          :nvidiaCardData="formOverclock[Number(activeName)][1]"
          :algorithmList="algorithmList"
        />
        <span v-else>
          {{ $t('public.noData') }}
        </span>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.close') }}
      </span>
      <!-- <span class="dialog-button dialog-save" @click="addUserFun">
        {{ $t('public.save') }}
      </span> -->
    </div>
  </el-dialog>
</template>

<script>
import overclockSet from './overclockSet.vue';
import {
  defaultOverclockAmd,
  defaultOverclockNvidia,
  isCheckbox,
} from './defaultOverclock';
export default {
  name: 'OverclockDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    algorithmName: {
      type: [Number, String],
      default: '',
    },
    detailsData: {
      type: Array,
      required: true,
    },
  },
  // 模板引入
  components: { overclockSet },
  // 数据
  data() {
    return {
      algorithmList: [],
      activeName: 0,
      isCheckbox: isCheckbox,
      formOverclock: [],
      algorithmNames: [], //算法名 => 集合
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    // addUserFun() {
    //   const { formOverclock } = this;
    //   let apiArr = [];
    //   formOverclock.forEach((item) => {
    //     if (item[0]) {
    //       let data = Object.copyArrObj(item[0]);
    //       for (let key in data) {
    //         if (isCheckbox.includes(key)) {
    //           data[key] = data[key] ? 'OPEN' : 'CLOSE';
    //         }
    //       }
    //       apiArr.push(this.$http.templatePresetAmdUpdate(data));
    //     }
    //     if (item[1]) {
    //       let data = Object.copyArrObj(item[1]);
    //       for (let key in data) {
    //         if (isCheckbox.includes(key)) {
    //           data[key] = data[key] ? 'OPEN' : 'CLOSE';
    //         }
    //       }
    //       apiArr.push(this.$http.templatePresetNvidiaUpdate(data));
    //     }
    //   });
    //   Promise.all(apiArr).then((res) => {
    //     console.log(res);
    //   });
    // },
    async algorithmBaseFindListApi() {
      const res = await this.$http.algorithmBaseFindList();
      if (res && res.length > 0) {
        this.algorithmList = res;
      }
    },
    initializationFun() {
      const { detailsData, algorithmName } = this;
      let cardData = [];
      detailsData.forEach((item, index) => {
        if (item.algorithmName === algorithmName) {
          this.activeName = `${index}`;
        }
        const { templateAmd, templateNvidia } = item;
        const _cardData = [];
        let _cardA = null;
        let _cardN = null;
        if (templateAmd) {
          _cardA = Object.copyArrObj(defaultOverclockAmd);
          for (let key in _cardA) {
            if (isCheckbox.includes(key)) {
              if (templateAmd[key] === 'OPEN') {
                _cardA[key] = true;
              } else {
                _cardA[key] = false;
              }
            } else if (templateAmd[key]) {
              _cardA[key] = templateAmd[key];
            }
          }
        }
        if (templateNvidia) {
          _cardN = Object.copyArrObj(defaultOverclockNvidia);
          for (let key in _cardN) {
            if (isCheckbox.includes(key)) {
              if (templateNvidia[key] === 'OPEN') {
                _cardN[key] = true;
              } else {
                _cardN[key] = false;
              }
            } else if (templateNvidia[key]) {
              _cardN[key] = templateNvidia[key];
            }
          }
        }
        if (_cardA) {
          _cardA.id = item.id;
        }
        if (_cardN) {
          _cardN.id = item.id;
        }
        _cardData[0] = _cardA;
        _cardData[1] = _cardN;
        cardData.push(_cardData);
      });
      this.formOverclock = cardData;
    },
  },
  // 创建后
  created() {
    this.initializationFun();
    this.algorithmBaseFindListApi();
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
<style lang="scss">
.overclock-list-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
