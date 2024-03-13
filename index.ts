import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { router as articles } from './routes/articles';
import { router as special } from './routes/specials';
import passport from "koa-passport";
import serve from 'koa-static';
// import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";

const app: Koa = new Koa();

// const welcomeAPI = async (ctx: RouterContext, next: any) => {
//   ctx.body = {
//     msg: "Welcome to the blog API"
//   };
//   await next();
// }

const router: Router = new Router();

// router.get('/api/v1', welcomeAPI);


// const customErrorMessage: CustomErrorMessageFunction = (
//     _ctx: RouterContext,
//     value: string
//    ) => {
//     return (
//     `The name must be between 3 and 20 ` +
//     `characters long but received length ${value.length}`
//     );
//    };

// router.get('/',
//     query("name")       // for the query string "name", e.g. http://localhost:10888?name=XXX
//     .isLength({ min: 3 , max: 10}).optional()
//     .withMessage(customErrorMessage)
//     .build()
//     , async (ctx: RouterContext, next: any) => {

//         const result = validationResults(ctx);
//         if (result.hasErrors()) {
//             ctx.status = 422;
//             ctx.body = { err: result.mapped() }
//         } else {
//             ctx.body = { msg: `Hello world! ${ctx.query.name}` };
//         }
//         await next();

// //        ctx.body = { msg: 'Hello world 1!' };
// //        await next();    // terminate the connection with the client
// })

// const validatorName = [
//     body("name").isLength({ min: 3}).withMessage(customErrorMessage).build(),
//     body("id").isInt({ min: 10000, max: 20000 }).build()
//    ]


// router.post('/', ...validatorName, async (ctx: RouterContext, next: any) => {
//     // const data = ctx.request.body;
//     // ctx.body = data;  // put request body content into response body
//     // await next();

//     const result = validationResults(ctx);
//     if (result.hasErrors()) {
//         ctx.status = 422;
//         ctx.body = { err: result.mapped() }
//     } else {
//         const data = ctx.request.body;
//         ctx.body = data;
//     }
//     await next();

// })


app.use(json());  // use json as request and response
app.use(logger());  // show output in console
app.use(bodyParser());
app.use(router.routes());
// app.use(articles.routes());
app.use(passport.initialize());
app.use(special.middleware());
app.use(articles.middleware());
// app.use(router.routes()).use(router.allowedMethods());
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