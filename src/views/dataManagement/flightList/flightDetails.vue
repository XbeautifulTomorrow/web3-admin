<template>
  <el-dialog
    :visible.sync="popupDialog"
    width="800px"
    :before-close="closePopup"
    class="public-dialog flight-dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <ul slot="title" class="flight-dialog-title">
      <li class="flight-dialog-title-list ellipsis-line">
        {{ detailsData.flightName }}
      </li>
      <li class="flight-dialog-title-list ellipsis-line">
        <span>{{ $t('farmList.id') }}:</span>
        <span>{{ detailsData.id }}</span>
      </li>
    </ul>
    <div class="flight-dialog-content" v-if="detailsData.flightSheets">
      <div
        class="flight-dialog-content-list"
        v-for="(item, index) in detailsData.flightSheets"
        :key="`flightSheets-${index}`"
      >
        <div class="flight-dialog-content-left">
          <flightCoin
            v-if="item.coin || item.wallet || item.poolConfig"
            :item="item"
          />
          <flightCoin
            v-if="item.viceCoin || item.viceWallet || item.vicePoolConfig"
            :item="item"
            :isVice="true"
          />
        </div>
        <div class="flight-dialog-content-right">
          <div class="content-top">
            <div class="content-top-lolminer">
              <span class="lolminer-text">{{ item.miningName || '--' }}</span>
              <span class="colorN lolminerN">N</span>
              <span class="colorA lolminerA">A</span>
            </div>
            <span>{{ item.miningVersion || '--' }}</span>
          </div>
          <ul class="content-bottom">
            <template v-for="(listData, key, showIndex) in detailsList(item)">
              <li
                v-if="listData && showText.includes(key)"
                :key="`show-${showIndex}`"
                class="show-list ellipsis-line"
              >
                <span class="details-title ellipsis-line">
                  {{ $t(`flight.${key}`) }}
                </span>
                <el-tooltip
                  placement="bottom-start"
                  :visible-arrow="false"
                  popper-class="atooltip"
                >
                  <div slot="content">
                    {{
                      key === 'poolServerIds'
                        ? item.poolName || 'Deepool'
                        : listData
                    }}
                  </div>
                  <span class="ellipsis-line">
                    {{
                      key === 'poolServerIds'
                        ? item.poolName || 'Deepool'
                        : listData
                    }}
                  </span>
                </el-tooltip>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
import flightCoin from './flightCoin.vue';
import detailsList from './detailsList';
export default {
  name: 'OverclockDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    detailsData: {
      type: Object,
      required: true,
    },
  },
  // 模板引入
  components: { flightCoin },
  // 数据
  data() {
    return {
      showText: [
        'coinName ',
        'walletAddress',
        'walletName',
        'poolServerIds',
        'serverUrl',
        'miningName',
        'miningVersion',
        'strength',
        'vicePoolName',
      ],
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    detailsList(listObj) {
      const data = detailsList(listObj);
      return data;
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
.flight-dialog-title {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 16px;
  font-weight: 600;
}
.flight-dialog-title-list {
  margin-right: 10px;
  max-width: 25%;
  height: 100%;
  &:last-child {
    margin-right: 0;
  }
}
.flight-dialog-content-list {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  &:first-child {
    padding-top: 0;
  }
}
.flight-dialog-content-left {
  margin-right: 20px;
  flex: 1;
}
.flight-dialog-content-right {
  flex: 1;
  overflow: hidden;
}
.content-top {
  display: flex;
  align-items: start;
  align-content: center;
  font-size: 16px;
}
.lolminerN,
.lolminerA {
  margin-left: 5px;
}
.content-top-lolminer {
  margin-right: 10px;
}
.show-list {
  line-height: 30px;
  display: flex;
  align-items: center;
  align-content: center;
}
.details-title {
  margin-right: 5px;
  min-width: max-content;
}
</style>
