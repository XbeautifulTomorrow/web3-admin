<template>
  <el-dialog
    :title="
      $t('userList.changePaw').replace(
        '{name}',
        userData ? userData.userName : ''
      )
    "
    :visible.sync="popupDialog"
    width="500px"
    :before-close="closePopup"
    :close-on-click-modal="false"
    class="public-dialog"
  >
    <el-form
      label-position="left"
      label-width="100px"
      :model="changePaw"
      :rules="rules"
      class="public-form dialog-content"
      ref="userForm"
    >
      <el-form-item
        class="half-input"
        :label="`${$t('userList.newPaw')}:`"
        prop="password"
      >
        <el-input
          v-model="changePaw.password"
          :placeholder="`${$t('public.write')}${$t('userList.newPaw')}`"
          clearable
        />
      </el-form-item>
      <el-form-item
        class="half-input"
        :label="`${$t('userList.confirmpassword')}:`"
        prop="confirmpassword"
      >
        <el-input
          v-model="changePaw.confirmpassword"
          :placeholder="
            `${$t('public.write')}${$t('userList.confirmpassword')}`
          "
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span
        class="dialog-button dialog-save"
        @click="baseUserUpdatePasswordApi"
      >
        {{ $t('public.sure') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { validPassWord } from '../../../utils/validate';
export default {
  name: 'ChangePaw',
  // 模板引入
  components: {},
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
    userData: {
      type: Object,
      required: true,
    },
  },
  // 数据
  data() {
    // 注册密码
    const passWordRegex = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('public.passwordMust')));
      } else if (0 < value.length && value.length < 8) {
        callback(new Error(this.$t('public.passwordLength')));
      } else {
        const isTrue = validPassWord(value);
        if (!isTrue) {
          callback(new Error(this.$t('public.passwordEro')));
        }
      }
      callback();
    };
    const confirmpasswordRegex = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('userList.confirmpasswordMust')));
      } else if (this.changePaw.password !== value) {
        callback(new Error(this.$t('userList.confirmpasswordNotPaw')));
      }
      callback();
    };
    return {
      changePaw: {
        id: '',
        password: '',
        confirmpassword: '',
      },
      rules: {
        password: [{ validator: passWordRegex, trigger: ['blur', 'change'] }],
        confirmpassword: [
          { validator: confirmpasswordRegex, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  // 方法
  methods: {
    closePopup(isApi = false) {
      this.$emit('closePopup', isApi);
    },
    baseUserUpdatePasswordApi() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          const { userData, changePaw } = this;
          const { id, userName } = userData;
          const res = await this.$http.baseUserUpdatePassword({
            id,
            password: changePaw.password,
          });
          if (res) {
            this.$message.success(
              this.$t('userList.changePawSuc').replace('{name}', userName)
            );
            this.closePopup();
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

<style lang="scss" scoped></style>
