import { MyncmcApi } from '../api/myncmc';

export class MyncmcService {
  // 登录
  //
  // 200为成功
  // 400为帐号或密码错误
  // 401为验证码错误
  // 500为网络错误
  async login(username: string, password: string) {
    return MyncmcApi.login(username, password);
  }

  // 获取成绩报表
  async getScoreReport() {
    const json = await MyncmcApi.getScoreJson();
    return MyncmcApi.getScoreReport(json);
  }
}
