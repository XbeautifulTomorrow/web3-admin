<template>
  <div class="left-list">
    <div class="left-first">
      <div class="content-top">
        <div class="content-top-coin" v-if="item[coin]">
          <img :src="item[coin].coinImage" alt="" class="icon" />
          <span>{{ item[coin].coinName }}</span>
        </div>
        <span v-if="item[wallet]" class="ellipsis-line">
          <el-tooltip
            placement="bottom-start"
            :visible-arrow="false"
            popper-class="atooltip"
          >
            <div slot="content">{{ item[wallet].walletName }}</div>
            <span>{{ item[wallet].walletName }}</span>
          </el-tooltip>
        </span>
      </div>
      <div class="content-bottom" v-if="item[wallet]">
        <p class="content-bottom-title">
          {{ $t('flight.walletAddress') }}
        </p>
        <p>{{ item[wallet].walletAddress }}</p>
      </div>
    </div>
    <div class="left-second">
      <div class="content-top">
        <span>{{ item.poolName }}</span>
      </div>
      <div class="content-bottom" v-if="item[poolConfig]">
        <p class="content-bottom-title">
          {{ $t('flight.serverUrl') }}
        </p>
        <p v-html="item[poolConfig].serverUrl.replace(/\n/g, '<br>')"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightCoin',
  props: {
    item: Object,
    isVice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      coin: this.isVice ? 'viceCoin' : 'coin',
      wallet: this.isVice ? 'viceWallet' : 'wallet',
      poolConfig: this.isVice ? 'vicePoolConfig' : 'poolConfig',
    };
  },
};
</script>

<style lang="scss" scoped>
.icon {
  max-width: 12px;
  max-height: 12px;
  margin-right: 5px;
}
.left-second {
  margin-left: 20px;
}
.content-top,
.content-top-coin {
  display: flex;
  align-content: center;
}
.content-top {
  align-items: start;
  margin-bottom: 20px;
}
.content-top-coin {
  margin-right: 30px;
  min-width: max-content;
  align-items: center;
}
.content-top-lolminer {
  margin-right: 15px;
}
.content-bottom-title {
  margin-bottom: 5px;
}
.left-list {
  display: flex;
}
.left-first {
  max-width: 50%;
}
</style>
