import { Middleware, WebMiddleware, provide } from 'midway';
import { cookieJar } from '../../util/axios';
import { MyncmcApi } from '../../api/myncmc';

@provide()
export class NeedMyncmcSession implements WebMiddleware {
  resolve(): Middleware {
    return async (ctx, next) => {
      if (!ctx.session.myncmc) {
        ctx.status = 401;
        return;
      }
      cookieJar.setCookieSync(ctx.session.myncmc, MyncmcApi.loginUrl);

      await next();
    };
  }
}
