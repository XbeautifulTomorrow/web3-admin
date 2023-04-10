import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import UserList from '@/views/userList/index';
import aside from '@/aside.vue';

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
  },
  {
    path: '/',
    component: aside,
    children: [
      {
        path: '',
        component: UserList,
        name: 'UserList',
      },
      {
        /** 用户列表 */
        path: '/userList',
        component: UserList,
        name: 'UserList',
      },
      {
        /** 平台NFT系列 */
        path: '/platformNftSeries',
        component: () => import('@/views/platformNftSeries/index'),
        name: 'PlatformNftSeries',
      },
      {
        /** 外部NFT系列 */
        path: '/externalNftSeries',
        component: () => import('@/views/externalNftSeries/index'),
        name: 'ExternalNftSeries',
      },
      {
        /** 市场管理 */
        path: '/marketManagement',
        component: () => import('@/views/marketManagement/index'),
        name: 'MarketManagement',
      },
      {
        /** 外部NFT管理 */
        path: '/externalNftManagement',
        component: () => import('@/views/externalNftManagement/index'),
        name: 'ExternalNftManagement',
      },
      {
        /** 平台NFT管理 */
        path: '/platformNftManagement',
        component: () => import('@/views/platformNftManagement/index'),
        name: 'PlatformNftManagement',
      },
      {
        /** 血池管理 */
        path: '/bloodPoolManagement',
        component: () => import('@/views/bloodPoolManagement/index'),
        name: 'BloodPoolManagement',
      },
      {
        /** 金流管理 */
        path: '/cashManagement',
        component: () => import('@/views/cashManagement/index'),
        name: 'CashManagement',
      },
      {
        /** 订单管理 */
        path: '/orderManagement',
        component: () => import('@/views/orderManagement/index'),
        name: 'OrderManagement',
      },

      {
        /** 闪兑管理 */
        path: '/flashManagement',
        component: () => import('@/views/flashManagement/index'),
        name: 'FlashManagement',
      },
      {
        /** 邀请返佣 */
        path: '/invitationRebate',
        component: () => import('@/views/invitationRebate/index'),
        name: 'invitationRebate',
      },
      {
        /** 返佣记录 */
        path: '/rebateRecord',
        component: () => import('@/views/rebateRecord/index'),
        name: 'RebateRecord',
      },
      {
        /** 积分流水 */
        path: '/integralTurnover',
        component: () => import('@/views/integralTurnover/index'),
        name: 'IntegralTurnover',
      },
      {
        path: '/report',
        component: () => import('@/views/report/index'),
        name: 'Report',
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
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  });

const router = createRouter();

// 获取原型对象push函数
const originalPush = VueRouter.prototype.push

// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace

// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token');
  if (to.name == 'login' || token) {
    next();
  } else {
    next({ name: 'login' });
  }
});

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
