<template>
  <el-dialog
    title="玩家详情"
    :visible.sync="popupDialog"
    width="1000px"
    :before-close="closePopup"
    class="public-dialog"
  >
    <div class="dialog-content" v-if="detailsData">
      <ul class="dialog-content-left">
        <li class="left-list">
          <span class="list-title">{{ $t('userList.UID') }}:</span>
          <span class="list-text">{{ detailsData.id || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('public.userName') }}:</span>
          <span class="list-text">{{ detailsData.userName || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('public.email') }}:</span>
          <span class="list-text">{{ detailsData.email || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('public.password') }}:</span>
          <span class="list-text">******</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('public.phone') }}:</span>
          <span class="list-text">{{ detailsData.phone || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('userList.telegram') }}:</span>
          <span class="list-text">{{ detailsData.telegram || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('userList.skype') }}:</span>
          <span class="list-text">{{ detailsData.skype || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title">{{ $t('userList.timeZone') }}:</span>
          <span class="list-text">{{ detailsData.timeZone || '--' }}</span>
        </li>
        <li class="left-list">
          <span class="list-title"
            >{{ $t('userList.companyInformation') }}:</span
          >
          <span class="list-text">{{ detailsData.companyInfo || '--' }}</span>
        </li>
      </ul>
      <div class="dialog-content-right">
        <div class="dialog-content-right-top">
          <ul class="dialog-content-right-top-left">
            <li class="top-left-list">
              <span>{{ $t('userList.farm') }}:&nbsp;</span>
              <span>{{ detailsData.farmNumber || '--' }}</span>
            </li>
            <li class="top-left-list">
              <span>{{ $t('userList.minerOnline2') }}:&nbsp;</span>
              <span>{{ detailsData.onlineMinerNumber || '--' }}</span>
            </li>
            <li class="top-left-list">
              <span>{{ $t('userList.graphicsCardNumber') }}:&nbsp;</span>
              <span>{{ detailsData.cardNumber || '--' }}</span>
            </li>
            <li class="top-left-list">
              <span>{{ $t('userList.totalComputingPower') }}:&nbsp;</span>
              <span>
                {{ Object.formatHashSize(detailsData.powers, 1).number }}
                {{ Object.formatHashSize(detailsData.powers, 1).digit }}
              </span>
            </li>
            <li class="top-left-list">
              <span>{{ $t('userList.wallet') }}:&nbsp;</span>
              <span>{{ detailsData.walletNumber || '--' }}</span>
            </li>
            <!-- <li class="top-left-list">
              <span>{{ $t('userList.balance') }}:</span>
              <span>{{ detailsData.walletNumber || '--' }}</span>
            </li> -->
            <li class="top-left-list time-list">
              <span>{{ $t('userList.registrationTime') }}:&nbsp;</span>
              <span>{{ timeForStrFun(detailsData.createTime) }}</span>
            </li>
            <li class="top-left-list time-list">
              <span>{{ $t('userList.lastLogin') }}:&nbsp;</span>
              <span>{{ timeForStrFun(detailsData.loginTime) }}</span>
            </li>
            <li class="top-left-list">
              <span>{{ $t('userList.currentState') }}:&nbsp;</span>
              <span
                :class="[
                  { greenColor: detailsData.userStatus === 'NORMAL' },
                  { redColor: detailsData.userStatus === 'FORZEN' },
                  { colorNine: detailsData.userStatus === 'REMOVE' },
                ]"
                >{{ $t(`userList.${detailsData.userStatus}`) }}</span
              >
            </li>
            <li class="top-left-list redColor time-list">
              <span>{{ $t('userList.freezePeriod') }}:&nbsp;</span>
              <span>{{ timeForStrFun(detailsData.frozenTime) }}</span>
            </li>
          </ul>
          <div class="dialog-content-right-top-right">
            <!-- 白名单 -->
            <!-- <div class="dialog-whitelist">
              <h3 class="top-right-title">{{ $t('userList.whitelist') }}:</h3>
              <el-input
                type="textarea"
                :rows="6"
                :autosize="{ minRows: 6, maxRows: 8 }"
                :placeholder="$t('public.enterContent')"
                v-model="textarea"
              />
            </div> -->
            <div class="dialog-reasonSuspension">
              <h3 class="top-right-title">
                {{ $t('userList.reasonSuspension') }}:
              </h3>
              <p>{{ detailsData.frozenReason || '--' }}</p>
            </div>
          </div>
        </div>
        <div class="dialog-content-right-bottom">
          <ul class="right-bottom-title">
            <li
              :class="[
                'right-bottom-title-list cursor',
                { 'choose-list disabled-cursor': activeIndex === 1 },
              ]"
              @click="handleSelect(1)"
            >
              {{ $t('public.login') }}
            </li>
            <!-- <li
              :class="[
                'right-bottom-title-list cursor',
                { 'choose-list disabled-cursor': activeIndex === 2 },
              ]"
              @click="handleSelect(2)"
            >
              {{ $t('userList.invitePlayers') }}
            </li> -->
          </ul>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            max-height="250"
          >
            <el-table-column
              prop="userIp"
              :label="$t('userList.loginIp')"
              align="center"
            />
            <el-table-column
              prop="place"
              :label="$t('userList.loginPlace')"
              align="center"
            />
            <el-table-column
              prop="createTime"
              :label="$t('userList.loginTime')"
              align="center"
            >
              <span slot-scope="scope">
                {{ timeForStrFun(scope.row.createTime) }}
              </span>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <span class="dialog-button dialog-close" @click="closePopup">
        {{ $t('public.close') }}
      </span>
      <!-- <span class="dialog-button dialog-save">
        {{ $t('public.revise') }}
      </span> -->
    </div>
  </el-dialog>
</template>

<script>
import { tzTime } from '../../../filters';
export default {
  name: 'UserDetails',
  props: {
    popupDialog: {
      type: Boolean,
      default: true,
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
      textarea: '',
      activeIndex: 1,
      tableData: [],
    };
  },
  computed: {},
  // 方法
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    handleSelect(index) {
      this.activeIndex = index;
    },
    timeForStrFun(time) {
      const _time = tzTime(time);
      return _time;
    },
    async baseUserLoginLogApi() {
      const res = await this.$http.baseUserLoginLog({
        id: this.detailsData.id,
        limit: 15,
      });
      if (res) {
        this.tableData = res;
      }
    },
  },
  // 创建后
  created() {
    this.baseUserLoginLogApi();
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
.public-dialog {
  color: #333;
}
.dialog-content {
  display: flex;
  font-size: 18px;
}
.dialog-content-left {
  width: 300px;
  margin-right: 15px;
}
.left-list {
  display: flex;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}
.list-title {
  display: inline-block;
  min-width: 100px;
  max-width: 100px;
}
.dialog-content-right {
  flex: 1;
  background-color: rgba(242, 242, 242, 1);
  border: 1px solid rgba(121, 121, 121, 1);
  border-radius: 5px;
  padding: 10px;
}
.dialog-content-right-top {
  display: flex;
}
.dialog-content-right-top-left,
.dialog-content-right-top-right {
  flex: 1;
}
.dialog-content-right-top-left {
  display: flex;
  flex-wrap: wrap;
}
.top-left-list {
  width: 50%;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  span:first-child {
    display: inline-block;
    min-width: max-content;
  }
  span:last-child {
    flex: 1;
  }
}
.time-list {
  width: 100%;
}
.dialog-whitelist {
  margin-bottom: 20px;
}
.top-right-title {
  margin-bottom: 5px;
  font-weight: normal;
}
.right-bottom-title {
  display: flex;
}
.right-bottom-title-list {
  padding: 8px 15px;
  background-color: rgba(215, 215, 215, 1);
  border: 1px solid rgba(170, 170, 170, 1);
}
.choose-list {
  background-color: rgba(255, 255, 255, 1);
}
</style>
