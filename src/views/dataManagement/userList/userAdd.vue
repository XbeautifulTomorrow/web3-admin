<template>
  <el-dialog
    :title="$t('userList.addPlayer2')"
    :visible.sync="popupDialog"
    width="650px"
    :before-close="closePopup"
    class="public-dialog"
    :modal="false"
    :close-on-click-modal="false"
  >
    <el-form
      label-position="left"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="public-form"
      ref="userForm"
    >
      <el-form-item :label="`${$t('public.phone')}:`" prop="phone">
        <el-input type="number" v-model="formData.phone" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('public.email')}:`" prop="email">
        <el-input v-model="formData.email" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('public.password')}:`" prop="passWord">
        <el-input v-model="formData.passWord" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('public.nickName')}:`" prop="userName">
        <el-input v-model="formData.userName" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('public.realName')}:`" prop="realName">
        <el-input v-model="formData.realName" clearable />
      </el-form-item>
      <el-form-item :label="`${$t('public.roleId')}:`" prop="roleId">
        <el-select
          v-model="formData.roleId"
          :placeholder="`${$t('public.select')}${$t('public.roleId')}`"
          class="roleId-select"
        >
          <el-option
            v-for="item in sysRoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.cancel') }}
      </span>
      <span class="dialog-button dialog-save" @click="addUserFun">
        {{ $t('public.create') }}
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { validPassWord, validPhone } from '../../../utils/validate';
export default {
  name: 'UserAdd',
  props: {
    popupDialog: {
      type: Boolean,
      default: false,
    },
  },
  // 模板引入
  components: {},
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
    // 电话号码
    const phoneRegex = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('public.phoneMust')));
      } else if (value.length !== 11) {
        callback(new Error(this.$t('public.phoneEro')));
      } else {
        const isTrue = validPhone(value);
        if (!isTrue) {
          callback(new Error(this.$t('public.phoneEro')));
        }
      }
      callback();
    };
    return {
      sysRoleList: [],
      formData: {
        phone: '',
        email: '',
        passWord: '',
        userName: '',
        realName: '',
        roleId: '',
      },
      rules: {
        phone: [{ validator: phoneRegex, trigger: ['blur', 'change'] }],
        email: [
          {
            required: true,
            message: this.$t('public.emailMust'),
            trigger: ['blur', 'change'],
          },
          {
            type: 'email',
            message: this.$t('public.emailEro'),
            trigger: ['blur', 'change'],
          },
        ],
        passWord: [{ validator: passWordRegex, trigger: ['blur', 'change'] }],
        userName: [
          {
            required: true,
            message: this.$t('public.nickNameMust'),
            trigger: ['blur', 'change'],
          },
          {
            min: 4,
            max: 50,
            message: this.$t('public.nickNameEro'),
            trigger: ['blur', 'change'],
          },
        ],
        realName: [
          {
            required: true,
            message: this.$t('public.realNameMust'),
            trigger: ['blur', 'change'],
          },
        ],
        roleId: [
          {
            required: true,
            message: this.$t('public.roleIdMust'),
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
    addUserFun() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.sysUserAdd(this.formData);
          if (res) {
            this.$message.success(this.$t('public.addSuc'));
            this.closePopup(true);
          }
        }
      });
    },
    async sysRoleListApi() {
      const res = await this.$http.sysRoleList();
      if (res && res.records) {
        this.sysRoleList = res.records;
      }
    },
  },
  // 创建后
  created() {
    this.sysRoleListApi();
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
.roleId-select {
  width: 100%;
}
</style>
