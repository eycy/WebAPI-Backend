import Router, { RouterContext } from "koa-router";
import { basicAuth } from '../controllers/auth';
import { createUser, addFavorite, getFavorites } from '../models/users.model';

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
  const { user_id, dog_id } = ctx.request.body;

  const result = await addFavorite(user_id, dog_id);

  if (result.success) {
    ctx.status = 201;
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
router.get('/favorites', basicAuth, getFavoritesRoute);

export { router };
