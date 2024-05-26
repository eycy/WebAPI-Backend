import { authenticate } from '../controllers/auth';
import * as model from '../models/users.model';
import bodyParser from "koa-bodyparser";
import Router from 'koa-router';
import { RouterContext } from 'koa-router';

const router = new Router({ prefix: '/api/v1/users' });

const createUserRoute = async (ctx: RouterContext, next: any) => {
  const userData = ctx.request.body;
  const result = await model.createUser(userData);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }

  await next();
};


const getByUsername = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  const dogs = await model.findByUserName(body.username);
  if (dogs.length)
    ctx.status = 200;
  else
    ctx.status = 404;

  await next();
}

const addFavoriteRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid } = ctx.request.body;

  const result = await model.addFavorite(userid, dogid);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

const removeFavoriteRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid } = ctx.request.body;
  const result = await model.removeFavorite(userid, dogid);

  if (result.success) {
    ctx.status = 200;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};


const getFavoritesRoute = async (ctx: RouterContext) => {

  const userId = ctx.state.user.user.id;
  const result = await model.getFavorites(userId);

  if (result.success) {
    console.log(result.favorites);
    const dogIds = result.favorites.map((favorite) => favorite.dog_id);
    ctx.status = 200;
    ctx.body = { dogIds };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

const submitAdoptionRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid, message } = ctx.request.body;

  const result = await model.submitAdoption(userid, dogid, message);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

const replyAdoptionRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { adoptionId, message, isAccept } = ctx.request.body;

  const result = await model.replyAdoption(adoptionId, message, isAccept);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};


const getAllAdoptionsRoute = async (ctx: RouterContext) => {
  if (ctx.state.user.user.isstaff) {
    const result = await model.getAllAdoptions();
    if (result.success) {
      ctx.status = 200;
      ctx.body = { result };
    } else {
      ctx.status = 500;
      ctx.body = { error: result.message };
    }
  } else {
    ctx.status = 501;
  }
};

const getAdoptionsRoute = async (ctx: RouterContext) => {

  const userId = ctx.state.user.user.id;
  const result = await model.getAdoptions(userId);

  if (result.success) {
    ctx.status = 200;
    ctx.body = { result };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

const deleteAdoptionRoute = async (ctx: RouterContext, next: any) => {
  const { adoptionid } = ctx.request.body;
  const result = await model.deleteAdoption(adoptionid);
  if (result.success) {
    ctx.status = 200;
    ctx.body = adoptionid;
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
}

router.post('/', createUserRoute);
router.get('/', getByUsername);
router.post('/', createUserRoute);
router.post('/addFavorite', authenticate, addFavoriteRoute);
router.post('/removeFavorite', authenticate, removeFavoriteRoute);
router.get('/favorites', authenticate, getFavoritesRoute);

router.post('/submitAdoption', authenticate, bodyParser(), submitAdoptionRoute);
router.get('/getAllAdoptions', authenticate, bodyParser(), getAllAdoptionsRoute);
router.get('/getAdoptions', authenticate, bodyParser(), getAdoptionsRoute);
router.post('/replyAdoption', authenticate, bodyParser(), replyAdoptionRoute);
router.del('/deleteAdoption', authenticate, bodyParser(), deleteAdoptionRoute);

export { router };
