<template>
  <el-container>
    <el-aside :width="`${asideWidth}px`" style="background-color: rgb(238, 241, 246)" class="width-animation nav">
      <div class="logoBox" style="background-color: #304156;">
        <div class="logo-box">

        </div>
        <div class="config-box">
          <el-select v-model="accountType" @change="changeAccount" placeholder="展示测试账号" clearable>
            <el-option label="展示测试账号" value="">
            </el-option>
            <el-option label="不展示测试账号" value="NORMAL">
            </el-option>
            <el-option label="只展示测试账号" value="INNER">
            </el-option>
          </el-select>
          <el-select v-model="coinConfig" @change="changeConfig" placeholder="结算币种">
            <el-option label="ETH" value="ETH">
            </el-option>
            <!-- <el-option label="USDT" value="USDT">
            </el-option> -->
          </el-select>
        </div>
      </div>
      <el-menu :default-openeds="[]" :default-active="defaultActive" @select="selectFun" :collapse="isCollapse"
        class="nav-ul">
        <el-menu-item index="report">
          <i class="el-icon-bank-card"></i>
          <span slot="title">{{ $t('nav.report') }}</span>
        </el-menu-item>
        <el-menu-item index="userList" class="menu-list">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="platformNftSeries" class="menu-list">
          <i class="el-icon-s-management"></i>
          <span>平台NFT系列</span>
        </el-menu-item>
        <el-menu-item index="externalNftSeries" class="menu-list">
          <i class="el-icon-s-management"></i>
          <span>外部NFT系列</span>
        </el-menu-item>
        <el-menu-item index="externalNftManagement" class="menu-list">
          <i class="el-icon-s-management"></i>
          <span>外部NFT管理</span>
        </el-menu-item>
        <el-menu-item index="platformNftManagement" class="menu-list">
          <i class="el-icon-s-management"></i>
          <span>平台NFT管理</span>
        </el-menu-item>
        <el-menu-item index="marketManagement" class="menu-list">
          <i class="el-icon-s-management"></i>
          <span>市场管理</span>
        </el-menu-item>
        <el-menu-item index="blindBoxManagement" class="menu-list">
          <i class="el-icon-box"></i>
          <span>盲盒管理</span>
        </el-menu-item>
        <el-menu-item index="bloodPoolManagement" class="menu-list">
          <i class="el-icon-s-finance"></i>
          <span>血池管理</span>
        </el-menu-item>
        <el-menu-item index="cashManagement" class="menu-list">
          <i class="el-icon-s-finance"></i>
          <span>金流管理</span>
        </el-menu-item>
        <el-menu-item index="withdrawalReview" class="menu-list">
          <i class="el-icon-stopwatch"></i>
          <span>提款审核</span>
        </el-menu-item>
        <el-menu-item index="orderManagement" class="menu-list">
          <i class="el-icon-s-order"></i>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="flashManagement" class="menu-list">
          <i class="el-icon-s-order"></i>
          <span>闪兑管理</span>
        </el-menu-item>
        <el-menu-item index="invitationRebate" class="menu-list">
          <i class="el-icon-coin"></i>
          <span>邀请返佣</span>
        </el-menu-item>
        <el-menu-item index="rebateRecord" class="menu-list">
          <i class="el-icon-document"></i>
          <span>返佣记录</span>
        </el-menu-item>
        <el-menu-item index="integralTurnover" class="menu-list">
          <i class="el-icon-document"></i>
          <span>积分流水</span>
        </el-menu-item>
        <el-menu-item index="setting" class="menu-list">
          <i class="el-icon-s-tools"></i>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container class="width-animation" :style="{ marginLeft: `${asideWidth}px` }">
      <el-header style="text-align: left; font-size: 12px">
        <div class="header-title">
          <div class="header-title-buttons cursor">
            <span @click="foldFun(false)" v-if="isCollapse">
              <svg-icon class-name="title-icon" icon-class="el-icon-s-unfold" />
            </span>
            <span @click="foldFun(true)" v-else>
              <svg-icon class-name="title-icon" icon-class="el-icon-s-fold" />
            </span>
          </div>
          <!-- <span class="title">{{ title }}</span>
          <span class="title title-middle colorNine" v-if="page">/</span> -->
          <span class="title">{{ page }}</span>
        </div>
      </el-header>
      <el-main :class="{
        'report-main': path === '/report',
      }">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Aside',
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      drawer: false,
      defaultActive: 'userList',
      title: '',
      page: '',
      isCollapse: false,
      asideWidth: 220,
      accountType: '',
      coinConfig: '',
      nav: [
        {
          label: 'report.report',
          page: 'report',
        },
        {
          label: '用户管理',
          page: 'userList',
        },
        {
          label: '平台NFT系列',
          page: 'platformNftSeries',
        },
        {
          label: '外部NFT系列',
          page: 'externalNftSeries',
        },
        {
          label: '外部NFT管理',
          page: 'externalNftManagement',
        },
        {
          label: '平台NFT管理',
          page: 'platformNftManagement',
        },
        {
          label: '市场管理',
          page: 'marketManagement',
        },
        {
          label: '盲盒管理',
          page: 'blindBoxManagement',
        },
        {
          label: '血池管理',
          page: 'bloodPoolManagement',
        },
        {
          label: '金流管理',
          page: 'cashManagement',
        },
        {
          label: '提款审核',
          page: 'withdrawalReview',
        },
        {
          label: '提款管理',
          page: 'withdrawalManagement',
        },
        {
          label: '订单管理',
          page: 'orderManagement',
        },
        {
          label: '闪兑管理',
          page: 'flashManagement',
        },
        {
          label: '邀请返佣',
          page: 'invitationRebate',
        },
        {
          label: '返佣记录',
          page: 'rebateRecord',
        },
        {
          label: '积分流水',
          page: 'integralTurnover',
        },
        {
          label: '系统设置',
          page: 'setting',
        },
      ],
    };
  },
  computed: {
    path() {
      return this.$route.path;
    },
  },
  // 方法
  methods: {
    changeAccount(event) {
      // 设置当前挖矿币种
      this.$store.dispatch("user/setAccountConfig", event);
    },
    changeConfig(event) {
      // 设置当前挖矿币种
      this.$store.dispatch("user/coinConfig", event);
    },
    foldFun(data) {
      this.isCollapse = data;
      if (data) {
        this.asideWidth = 65;
      } else {
        this.asideWidth = 220;
      }
    },
    selectFun(index, indexPage) {
      const { nav } = this;
      const _title = nav.filter((item) => item.page == indexPage[0]);
      this.page = _title[0].label;
      // if (indexPage.length > 1) {
      //   const _otherTitle = nav.filte   ((item) => item.page === indexPage[1]);
      //   this.page = _otherTitle[0].la   el;
      // } else {
      //   this.page = '';
      // }
      this.$router.push(`/${index}`);
    },
    pageFun() {
      const { path, nav } = this;
      const dataManagement = [
        'userList',
        'farmList',
        'minerList',
        'graphicsCardList',
        'overclockList',
        'walletsList',
        'flightList',
      ];
      const systemManagement = [
        'currencyList',
        'algorithmList',
        'miningSoftwareList',
        'overclockPresetsList',
        'orePoolList',
        'aCardManagementList',
      ];
      if (path === '/') {
        this.title = 'nav.dataManagement';
        this.page = '用户管理';
      } else {
        nav.forEach((item) => {
          if (`/${item.page}` === path) {
            this.defaultActive = item.page;
            if (dataManagement.includes(item.page)) {
              this.title = 'nav.dataManagement';
              this.page = item.label;
            } else if (systemManagement.includes(item.page)) {
              this.title = 'nav.systemManagement';
              this.page = item.label;
            } else {
              this.title = item.label;
              this.page = item.label;
            }
          }
        });
      }
    },
  },
  // 创建后
  created() {
    this.accountType = this.$store.getters.accountConfig;
    this.coinConfig = this.$store.getters.coinConfig;
    this.pageFun();
  },
  // 挂载后
  mounted() { },
  // 更新后
  updated() { },
  // 销毁
  beforeDestroy() { },
  watch: {
    path: function () {
      this.pageFun();
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  height: 16px;
}

.title {
  font-size: 22px;
}

.title-middle {
  margin: 0 10px;
}

.header-title {
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
}

.header-title-buttons {
  margin-right: 20px;
}

.report-main {
  padding: 20px 0 0;
}

.width-animation {
  // transition: all 0.05s;
}

.nav,
.nav-ul {
  min-height: 100vh;
}

.nav-ul {
  background-color: #304156;
}


.logoBox {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.config-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &>.el-select+.el-select {
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
.icon-slip {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%) rotate(0);
  transform-origin: center;
  z-index: 99;

  //   &.icon-slip-left {
  //     transform: translateY(-50%) rotate(0);
  //   }
  &.el-button {
    padding: 8px 0;
    border-radius: 0 4px 4px 0;
  }

  .svg-icon {
    min-height: 30px !important;
    min-width: 20px !important;
  }
}

.title-icon {
  font-size: 22px;
}

.el-aside {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.menu-list {
  display: flex;
  align-content: center;
  align-items: center;

  .title-icon {
    margin-right: 5px;
    width: 18px !important;
    height: 18px !important;
  }

  .other-icon {
    height: 16px !important;
    width: 16px !important;
  }
}
</style>
