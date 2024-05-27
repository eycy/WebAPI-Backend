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
  const body: { username?: string } = ctx.request.body;
  const dogs = await model.findByUserName(body.username);
  if (dogs.length)
    ctx.status = 200;
  else
    ctx.status = 404;

  await next();
}

interface AddRemoveFavoriteResult {
  success: boolean;
  message?: string;
}

const addFavoriteRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid }: { dogid?: number } = ctx.request.body;

  const result: AddRemoveFavoriteResult = await model.addFavorite(userid, dogid);

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
  const { dogid }: { dogid?: number } = ctx.request.body;
  const result: AddRemoveFavoriteResult = await model.removeFavorite(userid, dogid);

  if (result.success) {
    ctx.status = 200;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};


interface favoritesResult {
  dog_id?: number,
  user_id?: number
}

interface getFavoritesResult {
  success?: boolean;
  favorites?: favoritesResult[];
  message?: string;
}

const getFavoritesRoute = async (ctx: RouterContext) => {

  const userId = ctx.state.user.user.id;
  const result: getFavoritesResult = await model.getFavorites(userId);

  if (result.success) {
    console.log(result.favorites);
    const dogIds = result.favorites.map((favorite: { dog_id: number }) => favorite.dog_id);
    ctx.status = 200;
    ctx.body = { dogIds };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

interface SubmitAdoptionRequestBody {
  dogid?: number;
  message?: string;
}

const submitAdoptionRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid, message }: SubmitAdoptionRequestBody = ctx.request.body;

  const result = await model.submitAdoption(userid, dogid, message);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};


interface SubmitAdoptionRequestBody {
  adoptionId?: number;
  message?: string;
  isAccept?: boolean;
}

const replyAdoptionRoute = async (ctx: RouterContext) => {
  const { adoptionId, message, isAccept }: SubmitAdoptionRequestBody = ctx.request.body;

  const result = await model.replyAdoption(adoptionId, message, isAccept);

  if (result.success) {
    ctx.status = 201;
    ctx.body = { message: result.message };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};


interface GetAllAdoptionsRouteResult {
  message?: string;
  success: boolean;
}

const getAllAdoptionsRoute = async (ctx: RouterContext) => {
  if (ctx.state.user.user.isstaff) {
    const result: GetAllAdoptionsRouteResult = await model.getAllAdoptions();
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


interface GetAdoptionsRouteResult {
  message?: string;
  success: boolean;
}

const getAdoptionsRoute = async (ctx: RouterContext) => {

  const userId = ctx.state.user.user.id;
  const result: GetAdoptionsRouteResult = await model.getAdoptions(userId);

  if (result.success) {
    ctx.status = 200;
    ctx.body = { result };
  } else {
    ctx.status = 500;
    ctx.body = { error: result.message };
  }
};

interface GetAdoptionsRouteBody {
  adoptionid?: number;
}

const deleteAdoptionRoute = async (ctx: RouterContext, next: any) => {
  const { adoptionid }: GetAdoptionsRouteBody = ctx.request.body;
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
