import { Middleware, WebMiddleware, provide } from 'midway';
import { cookieJar } from '../../util/axios';
import { JwxtApi } from '../../api/jwxt';

@provide()
export class NeedJwxtSession implements WebMiddleware {
  resolve(): Middleware {
    return async (ctx, next) => {
      if (!ctx.session.jwxt) {
        ctx.status = 401;
        return;
      }
      cookieJar.setCookieSync(ctx.session.jwxt, JwxtApi.loginUrl);

      await next();
    };
  }
}
