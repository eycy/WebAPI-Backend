import Router, { RouterContext } from "koa-router";

import { createUser } from '../models/users.model';

const router = new Router({ prefix: '/api/v1/users' });

const createUserRoute = async (ctx: RouterContext, next: any) => {
  const userData = ctx.request.body;
  const result = await createUser(userData);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }

  await next();
};

router.put('/', createUserRoute);

export { router };
