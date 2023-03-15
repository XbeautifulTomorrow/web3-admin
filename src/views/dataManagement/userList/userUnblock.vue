<template>
  <el-dialog
    :title="$t('userList.unblockOther')"
    :visible.sync="popupDialog"
    width="550px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="dialog-content-top">
        <span class="dialog-content-title">{{ $t('userList.state') }}:</span>
        <span class="dialog-content-text">{{ $t('userList.ban') }}</span>
      </div>
      <div class="dialog-content-top">
        <span class="dialog-content-title">
          {{ $t('userList.automaticReleaseTime') }}:
        </span>
        <span class="dialog-content-text">{{ detailsData.frozenTime }}</span>
      </div>
      <div class="dialog-content-top">
        <span class="dialog-content-title">{{ $t('userList.reason') }}:</span>
        <span class="dialog-content-text reason-text">
          {{ detailsData.frozenReason }}
        </span>
      </div>
      <el-form
        label-position="left"
        label-width="100px"
        :model="baseUserRelieveFrozen"
        :rules="rules"
        class="public-form dialog-content-bottom"
        ref="userForm"
      >
        <el-form-item
          class="textarea-input"
          :label="`${$t('userList.illustrate')}:`"
          prop="frozenReason"
          label-width="100px"
        >
          <el-input
            type="textarea"
            :rows="6"
            :maxlength="100"
            :autosize="{ minRows: 6, maxRows: 8 }"
            :placeholder="$t('public.enterContent')"
            v-model="baseUserRelieveFrozen.frozenReason"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="baseUserRelieveFrozenApi">
        {{ $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserUnblock',
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
  components: {},
  // 数据
  data() {
    return {
      fettle: '',
      baseUserRelieveFrozen: {
        frozenReason: '',
      },
      rules: {
        frozenReason: [
          {
            required: true,
            message: this.$t('userList.illustrateMust'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    baseUserRelieveFrozenApi() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          const { baseUserRelieveFrozen, detailsData } = this;
          const res = await this.$http.baseUserRelieveFrozen({
            frozenReason: baseUserRelieveFrozen.frozenReason,
            id: detailsData.id,
          });
          if (res) {
            this.$message.success(
              this.$t('userList.unblockSuc').replace(
                /{name}/,
                detailsData.userName
              )
            );
            this.closePopup(true);
          }
        }
      });
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
.dialog-content-top {
  display: flex;
  align-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.public-input,
.public-select-box {
  margin-bottom: 0;
}
.dialog-content-title {
  display: inline-block;
  min-width: 100px;
}
.dialog-content-text {
  height: 40px;
  line-height: 40px;
  background-color: rgba(242, 242, 242, 1);
  flex: 1;
  padding: 0 20px;
  border-radius: 5px;
}
.reason-text {
  padding: 10px 20px;
  height: 120px;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 20px;
}
</style>
