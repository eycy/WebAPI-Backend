import Router, { RouterContext } from "koa-router";
import { basicAuth } from '../controllers/auth';
import { createUser, addFavorite, getFavorites, removeFavorite } from '../models/users.model';

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

const addFavoriteRoute = async (ctx: RouterContext) => {
  const userid = ctx.state.user.user.id;
  const { dogid } = ctx.request.body;

  const result = await addFavorite(userid, dogid);

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

  console.log(dogid);
  console.log(userid);
  const result = await removeFavorite(userid, dogid);

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
  const result = await getFavorites(userId);

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

router.post('/', createUserRoute);
router.post('/addFavorite', basicAuth, addFavoriteRoute);
router.post('/removeFavorite', basicAuth, removeFavoriteRoute);
router.get('/favorites', basicAuth, getFavoritesRoute);

export { router };
