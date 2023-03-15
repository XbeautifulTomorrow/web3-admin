<template>
  <el-dialog
    :title="$t('userList.FORZEN')"
    :visible.sync="popupDialog"
    width="500px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="left"
      label-width="100px"
      :model="formFrozen"
      :rules="rules"
      class="public-form dialog-content"
      ref="userForm"
    >
      <el-form-item
        class="half-input"
        :label="`${$t('userList.time')}:`"
        prop="number"
      >
        <el-input
          type="number"
          v-model.number="formFrozen.number"
          :placeholder="`${$t('public.write')}${$t('userList.time')}`"
          clearable
        />
      </el-form-item>
      <el-form-item prop="key" class="half-input">
        <el-select
          v-model="formFrozen.key"
          :placeholder="`${$t('public.select')}${$t('userList.state')}`"
          popper-class="public-select-box"
          class="public-select-box"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        class="textarea-input"
        :label="`${$t('userList.illustrate')}:`"
        prop="frozenReason"
      >
        <el-input
          type="textarea"
          :rows="6"
          :maxlength="100"
          :autosize="{ minRows: 6, maxRows: 8 }"
          :placeholder="$t('public.enterContent')"
          v-model="formFrozen.frozenReason"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="baseUserFrozenApi">
        {{ $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserSuspension',
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
      formFrozen: {
        number: '',
        key: 'DAY',
        frozenReason: '',
      },
      rules: {
        number: [
          {
            required: true,
            message: this.$t('userList.timeMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'number',
            message: this.$t('userList.timeEro'),
            trigger: ['blur', 'change'],
          },
        ],
        frozenReason: [
          {
            required: true,
            message: this.$t('userList.illustrateMust'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      options: [
        {
          value: 'SECOND',
          label: this.$t('public.SECOND'),
        },
        {
          value: 'MINUTE',
          label: this.$t('public.MINUTE'),
        },
        {
          value: 'HOUR',
          label: this.$t('public.HOUR'),
        },
        {
          value: 'DAY',
          label: this.$t('public.DAY'),
        },
        {
          value: 'WEEK',
          label: this.$t('public.WEEK'),
        },
        {
          value: 'MONTH',
          label: this.$t('public.MONTH'),
        },
        {
          value: 'YEAR',
          label: this.$t('public.YEAR'),
        },
      ],
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    baseUserFrozenApi() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          const { formFrozen, detailsData } = this;
          const data = { ...formFrozen, ...{ id: detailsData.id } };
          const res = await this.$http.baseUserFrozen(data);
          if (res) {
            this.$message.success(
              this.$t('userList.FORZENSUC').replace(
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
.dialog-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.public-select-box {
  margin-bottom: 0;
  margin-right: 0;
  width: 100%;
}

.dialog-content-title {
  display: inline-block;
  min-width: 60px;
}
.half-input {
  width: 50%;
}
.textarea-input {
  width: 100%;
}
</style>
