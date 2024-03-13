import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from '../models/articles.model';
import { basicAuth } from '../controllers/auth';
import { validateArticle } from '../controllers/validation';

// import passport from "koa-passport";

const router = new Router({ prefix: '/api/v1/articles' });

// const articles = [
//   { title: 'hello article', fullText: 'some text here to fill the body' },
//   { title: 'another article', fullText: 'again here is some text here to fill' },
//   { title: 'coventry university ', fullText: 'some news about coventry university' },
//   { title: 'smart campus', fullText: 'smart campus is coming to IVE' }
// ];

const getAll = async (ctx: RouterContext, next: any) => {
  //ctx.body = articles;

  const articles = await model.getAll();
  if (articles.length) {
    ctx.body = articles;
  } else {
    ctx.body = {};
  }
  await next();
}

const getById = async (ctx: RouterContext, next: any) => {
  // let id = +ctx.params.id;  // + converts to integer (javascript)
  // if ((id < articles.length + 1) && (id > 0)) {
  //   ctx.body = articles[id - 1];
  // } else {
  //   ctx.status = 404;
  // }

  const id = +ctx.params.id;
  const articles = await model.getById(id);
  if (articles.length)
    ctx.body = articles[0];
  else
    ctx.status = 404;

  await next();
}

const createArticle = async (ctx: RouterContext, next: any) => {
  // let { title, fullText } = ctx.request.body;
  // let newArticle = { title: title, fullText: fullText };
  // articles.push(newArticle);
  // ctx.status = 201;
  // ctx.body = newArticle;

  const body = ctx.request.body;
  const result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }

  await next();
}

// TODO
const updateArticle = async (ctx: RouterContext, next: any) => {
  // let id = +ctx.params.id;
  // if ((id < articles.length + 1) && (id > 0)) {
  //   let { title, fullText } = ctx.request.body;
  //   articles[id - 1].title = title;
  //   articles[id - 1].fullText = fullText;
  //   ctx.status = 200;
  //   ctx.body = articles[id - 1];
  // } else {
  //   ctx.status = 404;
  // }
  // const user = ctx.state.user;
  const userId = ctx.state.user.user.id;

  const body = ctx.request.body;
  const id = +ctx.params.id;
  const result = await model.update(body, id, userId);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }
  await next();
}


const deleteArticle = async (ctx: RouterContext, next: any) => {
  // let id = +ctx.params.id;
  // if ((id < articles.length + 1) && (id > 0)) {
  //   articles.splice(id - 1, 1);
  //   ctx.status = 200;
  //   ctx.body = articles;
  // } else {
  //   ctx.status = 404;
  // }

  const id = +ctx.params.id;
  const result = await model.deleteById(id);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = id;
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
}

router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle, updateArticle);
router.del('/:id([0-9]{1,})', deleteArticle);

export { router };