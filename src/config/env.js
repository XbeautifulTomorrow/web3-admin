const config = {
  dev: {
    api: '/mystery-web-admin',
  },
  test: {
    api: '/mystery-web-admin',
  },
  pre: {
    api: '/mystery-web-admin',
  },
  pro: {
    api: '/mystery-web-admin',
  },
};

export default {
  ENV: process.env.VUE_APP_DOMAIN_CONFIG,
  ...config[process.env.VUE_APP_DOMAIN_CONFIG],
};
