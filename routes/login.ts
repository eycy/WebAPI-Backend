import Router, { RouterContext } from "koa-router";
import { basicAuth } from '../controllers/auth';

const router = new Router({ prefix: '/api/v1/login' });

const login = async (ctx: RouterContext, next: any) => {

  ctx.status = 200;
  ctx.body = ctx.state.user;

  await next();
}


router.post('/', basicAuth, login);

export { router };
