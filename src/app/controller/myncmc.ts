import { Context, inject, controller, post, provide, get } from 'midway';
import { cookieJar } from '../../util/axios';
import { MyncmcService } from '../../service/myncmcService';
import { MyncmcApi } from '../../api/myncmc';

@provide()
@controller('/api/myncmc')
export class MyncmcController {
  @inject()
  ctx: Context;

  @inject()
  myncmcService: MyncmcService;

  @post('/login')
  async login() {
    const createRule = {
      username: { type: 'string' },
      password: { type: 'string' }
    };

    // 校验参数
    this.ctx.validate(createRule);

    const { username, password } = this.ctx.request.body;

    const result = await this.myncmcService.login(username, password);
    this.ctx.status = result;

    // 保存cookie
    const cookie = cookieJar.getCookieStringSync(MyncmcApi.loginUrl);
    this.ctx.logger.info(cookie);
    this.ctx.session.myncmc = cookie;
  }

  @post('/logout')
  async logout() {
    if (!this.ctx.session.myncmc) {
      return;
    }

    this.ctx.status = 200;
    this.ctx.session.myncmc = undefined;
  }

  @get('/score', { middleware: ['needMyncmcSession'] })
  async getScoreReport() {
    this.ctx.body = await this.myncmcService.getScoreReport();
  }
}
