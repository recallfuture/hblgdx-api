import { EggAppConfig, EggAppInfo, PowerPartial } from 'midway';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1566975602931_2354';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false
    }
  };

  config.session = {
    // 最多半小时
    maxAge: 1000 * 60 * 30
  };

  return config;
};
