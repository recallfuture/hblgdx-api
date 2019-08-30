import { Context, inject, controller, post, provide, get } from 'midway';
import { JxxtService } from '../../service/JxxtService';
import { JxxtApi } from '../../api/jxxt';
import { cookieJar } from '../../util/axios';

@provide()
@controller('/api/jxxt')
export class JxxtController {
  @inject()
  ctx: Context;

  @inject()
  jxxtService: JxxtService;

  @post('/login')
  async login() {
    const createRule = {
      username: { type: 'string' },
      password: { type: 'string' }
    };

    // 校验参数
    this.ctx.validate(createRule);

    const { username, password } = this.ctx.request.body;

    const result = await this.jxxtService.login(username, password);
    this.ctx.status = result;

    // 保存cookie
    const cookie = cookieJar.getCookieStringSync(JxxtApi.loginUrl);
    // this.ctx.logger.info(cookie);
    this.ctx.session.jxxt = cookie;
  }

  @post('/logout')
  async logout() {
    if (!this.ctx.session.jxxt) {
      return;
    }

    await this.jxxtService.logout();
    this.ctx.status = 200;
    this.ctx.session.jwxt = undefined;
  }

  @get('/reminders', { middleware: ['needJxxtSession'] })
  async getReminderList() {
    this.ctx.body = await this.jxxtService.getReminderList();
  }

  @get('/homeworks/:id', { middleware: ['needJxxtSession'] })
  async getHomeworkList() {
    const courseId = this.ctx.params.id;
    this.ctx.body = await this.jxxtService.getHomeworkList(courseId);
  }

  @get('/homeworks/detail/:id', { middleware: ['needJxxtSession'] })
  async getHomeworkDetail() {
    const homeworkId = this.ctx.params.id;
    this.ctx.body = await this.jxxtService.getHomeworkDetail(homeworkId);
  }

  @get('/courses', { middleware: ['needJxxtSession'] })
  async getAllCourses() {
    this.ctx.body = await this.jxxtService.getAllCourses();
  }

  @get('/resources', { middleware: ['needJxxtSession'] })
  async getResourceList() {
    const { courseId, folderId } = this.ctx.query;

    if (!courseId) {
      this.ctx.status = 422;
      this.ctx.body = { message: 'need courseId' };
      return;
    }

    this.ctx.body = await this.jxxtService.getResourceList(courseId, folderId);
  }
}
