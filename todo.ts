import Koa from "koa";
import { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
// import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";

const app: Koa = new Koa();
// const router: Router = new Router();

// const list: string[] = [];


// const customErrorMessage: CustomErrorMessageFunction = (
//     _ctx: RouterContext,
//     value: string
//    ) => {
//     return (
//     `The name must be between 3 and 20 ` +
//     `characters long but received length ${value.length}`
//     );
//    };

// router.get('/', async (ctx: RouterContext, next: any) => {

//   ctx.body = JSON.stringify(list);
//   await next();    // terminate the connection with the client
// })



// router.post('/', async (ctx: RouterContext, next: any) => {
//   const body: any = ctx.request.body;
//   list.push(body.item);
//   ctx.body = { msg: "item added" };  // put request body content into response body
//   await next();

// })


app.use(json());  // use json as request and response
app.use(logger());  // show output in console
app.use(bodyParser());
// app.use(router.routes()).use(router.allowedMethods());



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