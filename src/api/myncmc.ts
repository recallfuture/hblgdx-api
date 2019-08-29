import axios from '../util/axios';
import { ScoreReport } from '../model/scoreReport';
import { Score } from '../model/score';

export class MyncmcApi {
  // 我的煤医的基础url
  static baseUrl = 'http://www.myncmc.com/zt_jda.aspx';

  // 获取session用的url
  static sessionUrl = MyncmcApi.baseUrl + '?yzm=type';

  // 登录验证码文本地址
  static validateCodeStringUrl = MyncmcApi.baseUrl + '?type=yzm';

  // 登录验证码图片地址
  static validateCodeUrl = MyncmcApi.baseUrl + '?type=yzm_x';

  // 登录地址
  //
  // 参数：
  // zjh: 学号
  // mm: 密码
  // v_yzm: 验证码
  static loginUrl = MyncmcApi.baseUrl + '?type=login';

  // 获取学生基本信息
  static infoUrl = MyncmcApi.baseUrl + '?type=read&ch=info';

  // 准备成绩单
  static prepareUrl = MyncmcApi.baseUrl + '?type=read&ch=cjdq';

  // 成绩查询地址
  static scoreUrl = MyncmcApi.baseUrl + '?type=read&ch=cjjs';

  // 获取验证码
  private static async _getValidateCode() {
    // 获得必要的session
    await axios.get(this.sessionUrl);
    const response = await axios.get(this.validateCodeStringUrl);
    return response.data;
  }

  // 登录
  //
  // 200为成功
  // 400为帐号或密码错误
  // 401为验证码错误
  // 500为网络错误
  static async login(username: string, password: string): Promise<number> {
    if (!username || !password) {
      return 400;
    }

    const code = await this._getValidateCode();
    if (!code) {
      return 401;
    }

    const url = `${this.loginUrl}&zjh=${username}&mm=${password}&v_yzm=${code}`;
    console.log(url);
    const response = await axios.get(url);
    if (!response.data) {
      return 500;
    } else if (response.data !== 'ok') {
      console.log(response.data);
      return 400;
    }

    return 200;
  }

  // 获取成绩报表json
  static async getScoreJson() {
    await axios.get(this.infoUrl);
    await axios.get(this.prepareUrl);

    const response = await axios.get(this.scoreUrl, {
      responseType: 'json'
    });

    return response.data;
  }

  // 获取成绩报表
  static getScoreReport(object: any): ScoreReport {
    const result: ScoreReport = new ScoreReport();

    result.name = object.xingming;
    result.number = object.xuehao;
    result.departmentName = object.xisuo;
    result.className = object.banji;
    result.scores = this._getScoreList(object.chengji);

    return result;
  }

  // 获取成绩列表
  private static _getScoreList(array: []): Score[] {
    if (!array) {
      return [];
    }

    const reslut: Score[] = [];
    const length = array.length;
    const scoreNum = Math.floor(length / 6);

    for (let i = 0; i < scoreNum; i++) {
      const s = new Score();

      for (let j = 0; j < 6; j++) {
        const value = array[i * 6 + j];
        switch (j) {
          case 0:
            s.name = value;
            break;
          case 1:
            s.totalCredit = Number.parseFloat(value);
            break;
          case 2:
            s.score = Number.parseFloat(value);
            break;
          case 3:
            s.level = value;
            break;
          case 4:
            s.credit = Number.parseFloat(value);
            break;
          case 5:
            s.type = value;
            break;
        }
      }
      reslut.push(s);
    }
    return reslut;
  }
}
