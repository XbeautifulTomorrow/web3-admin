<template>
  <el-container>
    <el-aside
      :width="`${asideWidth}px`"
      style="background-color: rgb(238, 241, 246)"
      class="width-animation nav"
    >
      <el-menu
        :default-openeds="['dataManagement', 'systemManagement']"
        :default-active="defaultActive"
        @select="selectFun"
        :collapse="isCollapse"
        class="nav-ul"
      >
        <el-menu-item index="report">
          <i class="el-icon-bank-card"></i>
          <span slot="title">{{ $t('nav.report') }}</span>
        </el-menu-item>
        
        <el-submenu index="dataManagement">
          <template slot="title">
            <i class="el-icon-data-line"></i>
            <span slot="title">{{ $t('nav.dataManagement') }}</span>
          </template>
          <el-menu-item index="userList" class="menu-list">
            <i class="el-icon-user"></i>
            <span>{{ $t('userList.userList') }}</span>
          </el-menu-item>
          <el-menu-item index="farmList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="min" />
            <span> {{ $t('farmList.farmList') }}</span>
          </el-menu-item>
          <el-menu-item index="minerList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="miner" />
            {{ $t('minerList.minerList') }}
          </el-menu-item>
          <el-menu-item index="graphicsCardList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="card" />
            <span>{{ $t('graphicsCardList.graphicsCardList') }}</span>
          </el-menu-item>
          <el-menu-item index="overclockList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="overlock" />
            <span>{{ $t('overclock.overclockList') }}</span>
          </el-menu-item>
          <el-menu-item index="walletsList">
          <i class="el-icon-bank-card"></i>
          <span slot="title">{{ $t('wallet.walletsList') }}</span>
        </el-menu-item>
          <el-menu-item index="flightList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="flight" />
            <span>{{ $t('flight.flightList') }}</span>
          </el-menu-item>
        </el-submenu>
        
        <el-submenu index="systemManagement">
          <template slot="title">
            <i class="el-icon-cpu"></i>
            <span slot="title">{{ $t('nav.systemManagement') }}</span>
          </template>
          <el-menu-item index="currencyList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="coin" />
            <span>{{ $t('currency.currencyList') }}</span>
          </el-menu-item>
          <el-menu-item index="algorithmList" class="menu-list">
            <svg-icon class-name="title-icon" icon-class="algorithm" />
            <span>{{ $t('algorithm.algorithmList') }}</span>
          </el-menu-item>
          <el-menu-item index="miningSoftwareList" class="menu-list">
            <svg-icon
              class-name="title-icon other-icon"
              icon-class="miningSoftware"
            />
            <span>{{ $t('miningSoftware.miningSoftwareList') }}</span>
          </el-menu-item>
          <el-menu-item index="overclockPresetsList" class="menu-list">
            <svg-icon
              class-name="title-icon other-icon"
              icon-class="overclockPresets"
            />
            <span>{{ $t('overclockPresets.overclockPresets') }}</span>
          </el-menu-item>
          
          <el-menu-item index="orePoolList" class="menu-list">
            <svg-icon class-name="title-icon other-icon" icon-class="orePool" />
            <span>{{ $t('orePool.orePoolList') }}</span>
          </el-menu-item>
          <el-menu-item index="aCardManagementList" class="menu-list">
            <svg-icon
              class-name="title-icon other-icon"
              icon-class="aCardManagement"
            />
            <span>
              {{ $t('aCardManagement.aCardManagementList') }}
            </span>
          </el-menu-item>
        </el-submenu>
    
        <el-menu-item index="userMinerActiveList">
          <i class="el-icon-tickets"></i>
          <span slot="title">
            {{ $t('userMinerActive.userMinerActiveList') }}
          </span>
        </el-menu-item>
        <el-menu-item index="systemVersionManagementList">
          <i class="el-icon-setting"></i>
          <span slot="title">
            {{ $t('systemVersionManagement.systemVersionManagementList') }}
          </span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container
      class="width-animation"
      :style="{ marginLeft: `${asideWidth}px` }"
    >
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
          <span class="title">{{ $t(title) }}</span>
          <span class="title title-middle colorNine" v-if="page">/</span>
          <span class="title">{{ $t(page) }}</span>
        </div>
      </el-header>
      <el-main
        :class="{
          'report-main': path === '/report',
        }"
      >
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
      nav: [
        {
          label: 'report.report',
          page: 'report',
        },
        {
          label: 'nav.dataManagement',
          page: 'dataManagement',
        },
        {
          label: 'nav.systemManagement',
          page: 'systemManagement',
        },
        {
          label: 'userList.userList',
          page: 'userList',
        },
        {
          label: 'farmList.farmList',
          page: 'farmList',
        },
        {
          label: 'minerList.minerList',
          page: 'minerList',
        },
        {
          label: 'graphicsCardList.graphicsCardList',
          page: 'graphicsCardList',
        },
        {
          label: 'overclock.overclockList',
          page: 'overclockList',
        },
        {
          label: 'flight.flightList',
          page: 'flightList',
        },
        {
          label: 'currency.currencyList',
          page: 'currencyList',
        },
        {
          label: 'algorithm.algorithmList',
          page: 'algorithmList',
        },
        {
          label: 'miningSoftware.miningSoftwareList',
          page: 'miningSoftwareList',
        },
        {
          label: 'overclockPresets.overclockPresets',
          page: 'overclockPresetsList',
        },
        {
          label: 'orePool.orePoolList',
          page: 'orePoolList',
        },
        {
          label: 'aCardManagement.aCardManagementList',
          page: 'aCardManagementList',
        },
        {
          label: 'wallet.walletsList',
          page: 'walletsList',
        },
        {
          label: 'userMinerActive.userMinerActiveList',
          page: 'userMinerActiveList',
        },
        {
          label: 'systemVersionManagement.systemVersionManagementList',
          page: 'systemVersionManagementList',
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
      const _title = nav.filter((item) => item.page === indexPage[0]);
      this.title = _title[0].label;
      if (indexPage.length > 1) {
        const _otherTitle = nav.filter((item) => item.page === indexPage[1]);
        this.page = _otherTitle[0].label;
      } else {
        this.page = '';
      }
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
        this.page = 'userList.userList';
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
              this.page = '';
            }
          }
        });
      }
    },
  },
  // 创建后
  created() {
    this.pageFun();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
  // 销毁
  beforeDestroy() {},
  watch: {
    path: function() {
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
