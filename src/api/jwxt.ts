import axios from '../util/axios';
import * as iconv from 'iconv-lite';

// 教务系统的api
export class JwxtApi {
  // 教务系统的基础url
  // 同时也是登录页面地址
  static baseUrl = 'http://xjw1.ncst.edu.cn/';

  // 登录验证码地址
  static validateCodeUrl = JwxtApi.baseUrl + 'validateCodeAction.do';

  // 登录post地址
  static loginUrl = JwxtApi.baseUrl + 'loginAction.do';

  // 注销地址
  static logoutUrl = JwxtApi.baseUrl + 'logout.do';

  // 全部及格成绩查询地址
  static jgScoreUrl = JwxtApi.baseUrl + 'gradeLnAllAction.do?type=ln&oper=qb';

  // 不及格成绩查询地址
  static bjgScoreUrl = JwxtApi.baseUrl + 'gradeLnAllAction.do?type=ln&oper=bjg';

  // 错误的查找正则和状态码
  private static _errorMap: any = {
    '<title>学分制综合教务</title>': 200, // 登录成功
    '您的密码不正确，请您重新输入！': 400,
    '你输入的验证码错误，请您重新输入！': 401
  };

  // 用errorMap中的数据检查content中的具体错误
  //
  // content: 要检测的内容
  // defaultCode: 没有查找到的话返回这个值
  private static _getErrorCode(content: string, defaultCode = 400): number {
    for (const regex in this._errorMap) {
      const re = new RegExp(regex);

      if (re.test(content)) {
        return this._errorMap[regex];
      }
    }
    return defaultCode;
  }

  // 获取验证码
  static async getValidateCode() {
    const response = await axios.get(this.validateCodeUrl, {
      responseType: 'arraybuffer'
    });

    return response.data;
  }

  // 登录
  //
  // 参数:
  // username: 学号
  // password: 密码
  // code: 验证码
  //
  // 返回值:
  // 200为成功
  // 400为帐号或密码错误
  // 401为验证码错误
  // 500为未知错误
  static async login(username: string, password: string, code: string) {
    if (!!username || !!password || !!code) {
      return 400;
    }

    const response = await axios.post(
      this.loginUrl,
      {
        zjh1: '',
        tips: '',
        lx: '',
        evalue: '',
        fs: '',
        dzslh: '',
        zjh: username,
        mm: password,
        v_yzm: code
      },
      {
        responseType: 'arraybuffer'
      }
    );

    if (response.status === 200) {
      // 转码
      const content = iconv.decode(Buffer.concat(response.data), 'gbk');

      // 返回错误码
      return this._getErrorCode(content);
    } else {
      return 500;
    }
  }

  // 注销
  static logout() {
    return axios.get(this.logoutUrl);
  }
}
