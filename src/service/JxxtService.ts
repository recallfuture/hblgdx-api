import { provide } from 'midway';
import { JxxtApi } from '../api/jxxt';

@provide()
export class JxxtService {
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
  async login(username: string, password: string) {
    return JxxtApi.login(username, password);
  }

  // 注销
  async logout() {
    return JxxtApi.logout();
  }

  // 获取作业详情信息
  //
  // 登录后访问
  async getReminderList() {
    return JxxtApi.getReminderList();
  }

  // 获取单门课程的作业信息
  //
  // 登录后访问
  //
  // 返回这门课程的作业列表
  async getHomeworkList(courseId: string) {
    return JxxtApi.getHomeworkList(courseId);
  }

  // 获取所有的课程
  async getAllCourses() {
    return JxxtApi.getAllCourses();
  }

  // 获取资源列表
  async getResourceList(courseId: string, folderId = '0') {
    return JxxtApi.getResourceList(courseId, folderId);
  }
}
