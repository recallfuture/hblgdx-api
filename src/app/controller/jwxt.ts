import { Context, inject, controller, post, provide } from 'midway';
import { JwxtService } from '../../service/jwxtService';
import { cookieJar } from '../../util/axios';
import { JwxtApi } from '../../api/jwxt';

@provide()
@controller('/api/jwxt')
export class JwxtController {
  @inject()
  ctx: Context;

  @inject()
  jwxtService: JwxtService;

  @post('/login')
  async login() {
    const createRule = {
      username: { type: 'string' },
      password: { type: 'string' },
      code: { type: 'string' }
    };

    // 校验参数
    this.ctx.validate(createRule);

    const { username, password, code } = this.ctx.request.body;

    const result = await this.jwxtService.login(username, password, code);
    this.ctx.status = result;

    // 保存cookie
    const cookie = cookieJar.getCookieStringSync(JwxtApi.loginUrl);
    this.ctx.logger.info(cookie);
    this.ctx.session.jwxt = cookie;
  }

  @post('/logout')
  async logout() {
    if (!this.ctx.session.jwxt) {
      return;
    }

    await this.jwxtService.logout();
    this.ctx.status = 200;
    this.ctx.session.jwxt = undefined;
  }
}
