<template>
  <a :href="addressUrl" target="_blank">查看</a>
</template>

<script>
export default {
  props: {
    chain: {
      type: String,
      default: true,
    },
    hash: {
      type: String | Boolean,
      default: false,
    },
  },
  data() {
    return {
      addressUrl: "",
    };
  },
  mounted() {
    let chainType = this.chain.toUpperCase();
    const chainUrl = process.env[`VUE_APP_CHAIN_${chainType}_ADDR`];
    this.addressUrl = chainUrl + this.hash;
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #09a9ff;
}
</style>
