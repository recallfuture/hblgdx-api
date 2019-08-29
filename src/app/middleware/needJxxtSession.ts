import { Middleware, WebMiddleware, provide } from 'midway';
import { cookieJar } from '../../util/axios';
import { JxxtApi } from '../../api/jxxt';

@provide()
export class NeedJxxtSession implements WebMiddleware {
  resolve(): Middleware {
    return async (ctx, next) => {
      if (!ctx.session.jxxt) {
        ctx.status = 401;
        return;
      }
      ctx.logger.info(ctx.session.jxxt);
      cookieJar.setCookieSync(ctx.session.jxxt, JxxtApi.loginUrl);

      await next();
    };
  }
}
