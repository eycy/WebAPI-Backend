import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import { router as dogs } from './routes/dogs';
import { router as special } from './routes/specials';
import { router as login } from './routes/login';
import { router as users } from './routes/users';
import passport from "koa-passport";
import serve from 'koa-static';

const app: Koa = new Koa();
const router: Router = new Router();

app.use(cors());
app.use(json());  // use json as request and response
app.use(logger());  // show output in console
app.use(bodyParser());
app.use(router.routes());
app.use(passport.initialize());
app.use(special.middleware());
app.use(dogs.middleware());
app.use(login.middleware());
app.use(users.middleware());
app.use(serve('./docs'));

// this 404 must be defined before app.listen
app.use(async (ctx: RouterContext, next: any) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = { err: "No such endpoint existed" }  // define a json output
    }
  } catch (err: any) {
    ctx.body = { err: err }
  }
})

app.listen(10888, () => {
  console.log("Koa Started");
})