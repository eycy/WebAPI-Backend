import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";

import * as users from "../models/users.model";

const verifyPassword = (user: any, password: string) => {
  return user.password === password;
}

passport.use(new BasicStrategy(async (username, password, done) => {
  let result: any[] = [];
  try {
    result = await users.findByUserName(username);
  } catch (error) {
    console.error(`Error during authentication for user ${username}:${error}`);
    done(null, false);
  }
  if (result.length) {
    const user = result[0];
    if (verifyPassword(user, password)) {
      done(null, { user: user });
    } else {
      console.log(`Password incorrect for ${username}`);
      done(null, false);
    }
  } else {
    console.log(`No user found with username ${username}`);
    done(null, false);
  }
}));

export const basicAuth = async (ctx: RouterContext, next: any) => {
  await passport.authenticate("basic", { session: false }, async (err, user) => {
    if (err) {
      console.error(`Error during authentication: ${err}`);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
      return;
    }

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Unauthorized: Invalid credentials" };
      return;
    }

    // Store the authenticated user in ctx.state
    ctx.state.user = user;

    await next();
  })(ctx, next);
};