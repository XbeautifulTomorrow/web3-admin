<template>
  <el-dialog
    :visible.sync="popupDialog"
    width="900px"
    :before-close="closePopup"
    class="public-dialog commandPopup"
  >
    <p class="commandPopup_header" slot="title">
      <span class="commandPopup_header_day">
        {{ timeFormateFun(detailsData.sendTime) }}
      </span>
      <span>{{ detailsData.title }}</span>
    </p>
    <div
      class="commandPopup_content"
      v-html="returnInfoFun(detailsData.returnInfo)"
    ></div>
  </el-dialog>
</template>

<script>
import AnsiUp from 'ansi_up';
import { tzTime } from '../../../filters';
export default {
  name: 'UserMinerActiveListDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    detailsData: {
      type: Object,
      return: () => {
        return {};
      },
    },
  },
  created() {},
  // 方法
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    timeFormateFun(time) {
      const _time = tzTime(time, 'YYYY.MM.DD hh:mm:ss');
      return _time;
    },
    returnInfoFun(_text) {
      const ansi_up = new AnsiUp();
      let html = ansi_up.ansi_to_html(_text);
      if (html && html !== 'null') {
        return html;
      }
      return `<span>${this.$t('userMinerActive.notData')}</span>`;
    },
  },
};
</script>

<style lang="scss" scoped>
.commandPopup_text {
  line-height: 30px;
}
.commandPopup_header {
  // background-color: #818e9c;
  color: #16191d;
  text-align: left;
  padding-left: 12px;
  font-size: 16px;
}
.commandPopup_content {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 23px;
  font-family: 'PT Mono', monospace;
}
.commandPopup_header_day {
  margin-right: 15px;
}
</style>
<style lang="scss">
.commandPopup {
  .el-dialog {
    overflow: hidden;
  }
  .el-dialog__header {
    background-color: #818e9c;
  }
  .el-dialog__body {
    color: #fff;
    background-color: #16191d;
  }
  .el-dialog .el-dialog__header .el-dialog__headerbtn {
    &:hover {
      background: none;
    }
    i {
      color: #303336;
    }
  }
}
</style>
