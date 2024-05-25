import Router, { RouterContext } from "koa-router";
import { authenticate, authGoogleLogin, authGoogleLogout } from '../controllers/auth';

const router = new Router({ prefix: '/api/v1/login' });

const login = async (ctx: RouterContext, next: any) => {

  if (ctx.state.user) {
    ctx.status = 200;
    ctx.body = ctx.state.user;
  } else {
    ctx.status = 403;
    ctx.body = { error: 'Bad request' };
  }
  await next();
}

router.post('/', authenticate, login);
router.post("/auth/googleLogin", authGoogleLogin, login);
router.post('/auth/google/logout', authGoogleLogout);

export { router };
