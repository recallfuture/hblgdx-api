import { EggPlugin } from 'midway';
export default {
  static: true, // default is true
  validate: {
    enable: true,
    package: 'egg-validate'
  }
} as EggPlugin;
