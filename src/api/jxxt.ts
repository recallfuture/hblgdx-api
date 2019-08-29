import axios, { getGbkContent } from '../util/axios';
import * as qs from 'qs';
import * as iconv from 'iconv-lite';
import * as jsdom from 'jsdom';
import { Course } from '../model/course';
import { Homework } from '../model/homework';

// 教学系统的api
export class JxxtApi {
  // 教学系统的基础url
  static baseUrl = 'http://elearning.ncst.edu.cn/meol/';

  // 登录地址
  static loginUrl = JxxtApi.baseUrl + 'loginCheck.do';

  // 注销地址
  static logoutUrl = JxxtApi.baseUrl + 'homepage/V8/include/logout.jsp';

  // 未完成作业的列表地址
  static reminderListUrl =
    JxxtApi.baseUrl + 'welcomepage/student/interaction_reminder_v8.jsp';

  // 进入课程页面的地址
  //
  // 参数：
  // courseId
  static courseUrl = JxxtApi.baseUrl + 'jpk/course/layout/newpage/index.jsp';

  // 作业列表地址
  static homeworkListUrl = JxxtApi.baseUrl + 'common/hw/student/hwtask.jsp';

  // 作业详情地址
  //
  // 参数：
  // hwtid
  static homeworkDetailUrl =
    JxxtApi.baseUrl + 'common/hw/student/hwtask.view.jsp';

  // 所有课程列表的地址
  static courseListUrl =
    JxxtApi.baseUrl + 'welcomepage/student/course_list_v8.jsp';

  // 课程资源列表地址
  //
  // 参数：
  // lid
  // folderid
  static resourceListUrl = JxxtApi.baseUrl + 'common/script/listview.jsp';

  // 资源下载地址
  //
  // 参数：
  // fileid
  // lid
  // folderid
  static resourceDownloadUrl = JxxtApi.baseUrl + 'common/script/download.jsp';

  // 资源下载地址
  //
  // 参数：
  // fileid
  // lid
  // resid
  static resourceDownloadPreviewUrl =
    JxxtApi.baseUrl + 'common/script/preview/download_preview.jsp';

  // 获取csrf token
  static async _getToken(): Promise<string | null> {
    const content = await getGbkContent(this.loginUrl);
    const re = /<input type="hidden" name="logintoken" value="(\d+)"\/>/;

    const match = re.exec(content);
    if (!match) {
      return null;
    }
    return match[1];
  }

  // 错误的查找正则和状态码
  private static _errorMap: any = {
    '用户名或密码错误！': 400,
    '您已登录失败5次，账号被锁定，请您明天再试！': 403
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

  // 登录
  //
  // username: 用户名
  // password: 密码
  //
  // 返回值：状态码
  // 200为成功
  // 400为帐号或密码错误
  // 401为token错误
  // 403为帐号被锁，无权进入
  // 500为网络错误
  static async login(username: string, password: string): Promise<number> {
    if (!username || !password) {
      return 400;
    }

    // 获取token
    const token = await this._getToken();
    if (token === null) {
      return 401;
    }

    // 为了兼容学校的老网站，需要用application/x-www-form-urlencoded方式提交数据
    const data = qs.stringify({
      logintoken: token,
      enterLid: '',
      IPT_LOGINUSERNAME: username,
      IPT_LOGINPASSWORD: password
    });

    const response = await axios.post(this.loginUrl, data, {
      responseType: 'arraybuffer'
    });

    // 重定向意味着成功登录了
    if (response.status === 302) {
      // 登录成功
      return 200;
    } else if (response.status === 200) {
      // 转码
      const content = iconv.decode(response.data, 'gbk');

      // 返回错误码
      return this._getErrorCode(content, 400);
    } else {
      return 500;
    }
  }

  // 注销
  static logout() {
    return axios.get(this.logoutUrl);
  }

  // 获取待交作业的课程信息
  //
  // 需要登录后访问
  // 返回由课程号和课程名组成的map
  static async getReminderList(): Promise<Course[]> {
    const content = await getGbkContent(this.reminderListUrl);
    const re = new RegExp(
      '<a href="./lesson/enter_course.jsp?lid=(\\d+)&t=hw" target="_blank">(.+?)</a></li>',
      'g'
    );

    const result = [];
    let match = re.exec(content);

    while (match) {
      const id = match[1].trim();
      const name = match[1].trim();

      const course: Course = { id, name };
      result.push(course);

      match = re.exec(content);
    }

    return result;
  }

  // 获取作业详情信息
  //
  // 登录后访问
  static async getHomeworkDetail(homeworkId: string): Promise<string | null> {
    const content = await getGbkContent(
      `${this.homeworkDetailUrl}?hwtid=${homeworkId}`
    );
    if (content == null) {
      return null;
    }

    // 获取虚拟dom
    const document = new jsdom.JSDOM(content).window.document;
    const input = document.querySelector('input[type=hidden]');

    if (input !== null) {
      let html = input.getAttribute('value');
      if (html === null) {
        return null;
      }
      html = html.replace('&lt;', '<');
      html = html.replace('&gt;', '>');
      html = html.replace('&quot;', '"');
      html = html.replace('&amp;', '&');
      return html;
    }

    return null;
  }

  // 获取单门课程的作业信息
  //
  // 登录后访问
  //
  // 返回这门课程的作业列表
  static async getHomeworkList(courseId: string): Promise<Homework[]> {
    const result: Homework[] = [];

    // 需要先访问这个课程地址才能通过下面的固定地址得到正确的作业信息
    await axios.get(`${this.courseUrl}?courseId=${courseId}`);
    const content = await getGbkContent(this.homeworkListUrl);
    if (content == null) {
      return result;
    }

    // 获取虚拟dom
    const document = new jsdom.JSDOM(content).window.document;
    const trList = document.getElementsByTagName('tr');

    // i=0时获取的是th头信息，需要跳过
    for (let i = 1; i < trList.length; i++) {
      const tdList = trList[i].getElementsByTagName('td');
      result.push(this._getHomeworkFromTdList(tdList));
    }

    return result;
  }

  // 从td节点列表中获取作业信息
  private static _getHomeworkFromTdList(
    list: HTMLCollectionOf<HTMLTableDataCellElement>
  ): Homework {
    const result = new Homework();

    for (let i = 0; i < list.length; i++) {
      const td = list[i];

      switch (i) {
        case 0:
          const a = td.querySelector('a');
          result.title = a === null ? '' : a.innerHTML.trim();
          break;
        case 1:
          result.dateTime = td.innerHTML.trim();
          break;
        case 2:
          result.score = td.innerHTML.trim();
          break;
        case 3:
          result.publisher = td.innerHTML.trim();
          break;
        case 4:
          result.countUrl = this._getUrlFromTd(td);
          break;
        case 5:
          result.submitUrl = this._getUrlFromTd(td);
          break;
        case 6:
          result.resultUrl = this._getUrlFromTd(td);
          break;
      }
    }

    result.id = this._getHomeworkId(result.countUrl);
    return result;
  }

  // 从td中获取url
  private static _getUrlFromTd(td: HTMLTableDataCellElement): string {
    const a = td.querySelector('a');
    return a === null ? '' : this.homeworkListUrl + a.getAttribute('href');
  }

  // 从统计信息url中获得作业id
  private static _getHomeworkId(countUrl: string): string {
    const re = /hwtid=(\d+)/;
    const match = re.exec(countUrl);
    if (match === null) {
      return '';
    }
    return match[1];
  }
}
