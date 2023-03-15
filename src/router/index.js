import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import UserList from '@/views/dataManagement/userList/index';
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
        path: '/userList',
        component: UserList,
        name: 'UserList',
      },
      {
        path: '/farmList',
        component: () => import('@/views/dataManagement/farmList/index'),
        name: 'MineList',
      },
      {
        path: '/minerList',
        component: () => import('@/views/dataManagement/minerList/index'),
        name: 'MinerList',
      },
      {
        path: '/graphicsCardList',
        component: () =>
          import('@/views/dataManagement/graphicsCardList/index'),
        name: 'GraphicsCardList',
      },
      {
        path: '/overclockList',
        component: () => import('@/views/dataManagement/overclockList/index'),
        name: 'OverclockList',
      },
      {
        path: '/flightList',
        component: () => import('@/views/dataManagement/flightList/index'),
        name: 'FlightList',
      },
      {
        path: '/walletsList',
        component: () => import('@/views/dataManagement/walletsList/index'),
        name: 'WalletsList',
      },
      {
        path: '/currencyList',
        component: () => import('@/views/systemManagement/currencyList/index'),
        name: 'CurrencyList',
      },
      {
        path: '/algorithmList',
        component: () => import('@/views/systemManagement/algorithmList/index'),
        name: 'AlgorithmList',
      },
      {
        path: '/miningSoftwareList',
        component: () =>
          import('@/views/systemManagement/miningSoftwareList/index'),
        name: 'MiningSoftwareList',
      },
      {
        path: '/overclockPresetsList',
        component: () =>
          import('@/views/systemManagement/overclockPresetsList/index'),
        name: 'OverclockPresetsList',
      },
      {
        path: '/orePoolList',
        component: () => import('@/views/systemManagement/orePoolList/index'),
        name: 'OrePoolList',
      },
      {
        path: '/aCardManagementList',
        component: () =>
          import('@/views/systemManagement/aCardManagementList/index'),
        name: 'ACardManagementList',
      },
      {
        path: '/systemVersionManagementList',
        component: () =>
          import('@/views/systemManagement/systemVersionManagementList/index'),
        name: 'SystemVersionManagementList',
      },
      {
        path: '/userMinerActiveList',
        component: () =>
          import('@/views/systemManagement/userMinerActiveList/index'),
        name: 'UserMinerActiveList',
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
