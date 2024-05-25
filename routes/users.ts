import Router, { RouterContext } from "koa-router";
import { authenticate } from '../controllers/auth';
import { createUser, addFavorite, getFavorites, removeFavorite, findByUserName } from '../models/users.model';

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


const getByUsername = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  const dogs = await findByUserName(body.username);
  if (dogs.length)
    ctx.status = 200;
  else
    ctx.status = 404;

  await next();
}

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

router.get('/', getByUsername);
router.post('/', createUserRoute);
router.post('/addFavorite', authenticate, addFavoriteRoute);
router.post('/removeFavorite', authenticate, removeFavoriteRoute);
router.get('/favorites', authenticate, getFavoritesRoute);

export { router };
