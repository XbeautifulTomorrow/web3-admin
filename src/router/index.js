import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import UserList from "@/views/userList/index";
import aside from "@/aside.vue";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
  },
  {
    path: "/",
    component: aside,
    children: [
      {
        path: "",
        component: UserList,
        name: "UserList",
      },
      {
        /** 用户列表 */
        path: "/userList",
        component: UserList,
        name: "UserList",
      },
      {
        /** 平台NFT系列 */
        path: "/platformNftSeries",
        component: () => import("@/views/platformNftSeries/index"),
        name: "PlatformNftSeries",
      },
      {
        /** 外部NFT系列 */
        path: "/externalNftSeries",
        component: () => import("@/views/externalNftSeries/index"),
        name: "ExternalNftSeries",
      },
      {
        /** 外部NFT管理 */
        path: "/externalNftManagement",
        component: () => import("@/views/externalNftManagement/index"),
        name: "ExternalNftManagement",
      },
      {
        /** 平台NFT管理 */
        path: "/platformNftManagement",
        component: () => import("@/views/platformNftManagement/index"),
        name: "PlatformNftManagement",
      },
      {
        /** 平台NFT管理 */
        path: "/userNftList",
        component: () => import("@/views/userNftList/index"),
        name: "UserNftList",
      },
      {
        /** 一元购管理 */
        path: "/nftBuyManagement",
        component: () => import("@/views/nftBuyManagement/index"),
        name: "NftBuyManagement",
      },
      {
        /** 一元购收票记录 */
        path: "/nftBuyRecord",
        component: () => import("@/views/nftBuyRecord/index"),
        name: "NftBuyRecord",
      },
      {
        /** 市场管理 */
        path: "/marketManagement",
        component: () => import("@/views/marketManagement/index"),
        name: "MarketManagement",
      },
      {
        /** 盲盒管理 */
        path: "/blindBoxManagement",
        component: () => import("@/views/blindBoxManagement/index"),
        name: "BlindBoxManagement",
      },
      {
        /** 血池管理 */
        path: "/bloodPoolManagement",
        component: () => import("@/views/bloodPoolManagement/index"),
        name: "BloodPoolManagement",
      },
      {
        /** 血池管理 */
        path: "/blindBoxTest",
        component: () => import("@/views/blindBoxTest/index"),
        name: "BlindBoxTest",
      },
      {
        /** 金流管理 */
        path: "/cashManagement",
        component: () => import("@/views/cashManagement/index"),
        name: "CashManagement",
      },
      {
        /** 提现审核 */
        path: "/withdrawalReview",
        component: () => import("@/views/withdrawalReview/index"),
        name: "WithdrawalReview",
      },
      {
        /** 订单管理 */
        path: "/orderManagement",
        component: () => import("@/views/orderManagement/index"),
        name: "OrderManagement",
      },
      {
        /** 闪兑管理 */
        path: "/flashManagement",
        component: () => import("@/views/flashManagement/index"),
        name: "FlashManagement",
      },
      {
        /** 邀请返佣 */
        path: "/invitationRebate",
        component: () => import("@/views/invitationRebate/index"),
        name: "invitationRebate",
      },
      {
        /** 返佣记录 */
        path: "/rebateRecord",
        component: () => import("@/views/rebateRecord/index"),
        name: "RebateRecord",
      },
      {
        /** 积分流水 */
        path: "/integralTurnover",
        component: () => import("@/views/integralTurnover/index"),
        name: "IntegralTurnover",
      },
      {
        /** 系统设置 */
        path: "/setting",
        component: () => import("@/views/setting/index"),
        name: "Setting",
      },
      {
        path: "/report",
        component: () => import("@/views/report/index"),
        name: "Report",
      },
      {
        /** 群发邮件 */
        path: "/email",
        component: () => import("@/views/email/index"),
        name: "email",
      },
      {
        /** 钱包管理-充值钱包 */
        path: "/walletRechargeList",
        component: () => import("@/views/walletRechargeList/index.vue"),
        name: "walletRechargeList",
      },
      {
        /** 钱包管理-盲盒抽奖钱包 */
        path: "/walletUnboxLottery",
        component: () => import("@/views/walletUnboxLottery/index"),
        name: "walletUnboxLottery",
      },
      {
        /** 钱包管理-一元购抽奖钱包 */
        path: "/walletOneDollarLottery",
        component: () => import("@/views/walletOneDollarLottery/index"),
        name: "walletOneDollarLottery",
      },
      {
        /** 钱包管理-提款钱包 */
        path: "/walletDrawMoney",
        component: () => import("@/views/walletDrawMoney/index"),
        name: "walletDrawMoney",
      },
      {
        /** 钱包管理-GAS钱包 */
        path: "/walletGAS",
        component: () => import("@/views/walletGAS/index"),
        name: "walletGAS",
      },
      {
        /** 钱包管理-NFT购买钱包 */
        path: "/walletNFTBuy",
        component: () => import("@/views/walletNFTBuy/index"),
        name: "walletNFTBuy",
      },
    ],
  },
];

const createRouter = () =>
  new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      window.scrollTo(0, 0);
      return { x: 0, y: 0 };
    },
    mode: "history",
    base: process.env.BASE_URL,
    routes,
  });

const router = createRouter();

// 获取原型对象push函数
const originalPush = VueRouter.prototype.push;

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace;

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token");
  if (to.name == "login" || token) {
    next();
  } else {
    next({ name: "login" });
  }
});

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
