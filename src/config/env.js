const config = {
  dev: {
    api: 'http://221.236.31.34:13082/operation-web-admin',
    // api:"http://www.huobimall.com:18800/mall-cloud-admin"
  },
  test: {
    api: '/operation-web-admin',
  },
  pre: {
    api: '/operation-web-admin',
  },
  pro: {
    api: '/operation-web-admin',
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
