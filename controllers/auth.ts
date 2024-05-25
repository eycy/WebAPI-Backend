import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

import * as users from "../models/users.model";
import { config } from '../config';

const determineAuthMethod = (ctx) => {
  // Check if the request includes an "Authorization" header
  const authorizationHeader = ctx.headers.authorization;
  if (authorizationHeader) {
    if (authorizationHeader.startsWith("Basic ")) {
      console.log('basic');
      return "basic";
    }
    if (authorizationHeader.startsWith("Bearer ")) {
      return "oauth";
    }
  }
  // Return the default authentication method or handle unsupported cases
  return "oauth";
};


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


passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://oauth2.googleapis.com/token",
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: "https://d55ca820-5967-4c3f-a2e7-9bdda8343ba3-00-198tjdth2azr9.pike.replit.dev/api/v1/login/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('in passport OAtuh2Strategy');
      try {
        const user = await users.findByUserName(profile.emails[0].value);
        if (user) {
          done(null, { user: user });
        } else {
          done(null, false);
        }
      } catch (error) {
        console.error(`Error during authentication: ${error}`);
        done(error, false);
      }
    }
  )
);

const verifyAccessToken = (user: any, accesstoken: string) => {
  return user.accesstoken === accesstoken;
}


export const authGoogleLogin = async (ctx, next) => {
  console.log('in oauthAuth');
  const body = ctx.request.body;
  const accessToken = body.accessToken;
  const responseData = body.responseData;

  console.log(accessToken);
  console.log(responseData);

  let result: any[] = [];
  try {
    result = await users.findByUserName(responseData.email);
    console.log(result);
  } catch (error) {
    console.error(`Error during authentication for user ${responseData.email}:${error}`);
    // done(null, false);
  }
  if (result.length) {  // user exists
    const user = result[0];
    console.log(user);
    if (!user.accessToken) {  // if no token in db, then update
      await users.updateAccessToken(user.id, accessToken);
      ctx.state.user = user;
    } else if (verifyAccessToken(user, accessToken)) {
      // done(null, { user: user });
      console.log('token matches');

      ctx.state.user = user;
    } else {
      console.log(`token incorrect for ${responseData.email}`);
      // done(null, false);
    }
  } else {  // create user
    console.log(`No user found with username ${responseData.email}, create user`);

    await users.createUser({ firstname: responseData.given_name, lastname: responseData.family_name, username: responseData.email, password: null, email: responseData.email, accesstoken: accessToken });

    const user = await users.findByUserName(responseData.email);
    console.log(user);
    ctx.state.user = user;
    // done(null, false);
  }

  await next();
};



// OAuth Authentication Middleware
export const authGoogle = async (ctx, next) => {
  console.log('in authGoogle');
  console.log(ctx.state.user);
  await passport.authenticate('oauth2', { session: false }, async (err, user) => {
    if (err) {
      console.error(`Error during Google authentication: ${err}`);
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
      return;
    }

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: "Unauthorized: Invalid Google credentials" };
      return;
    }

    // Store the authenticated user in ctx.state
    ctx.state.user = user;

    await next();
  })(ctx, next);
};

export const authGoogleLogout = async (ctx, next) => {
  console.log('in authGoogleLogout');
  console.log(ctx.state.user);

  if (ctx.request.body.logout) {
    // Handle the logout process
    const user = ctx.state.user;
    if (user) {
      // Clear the user session or access token
      await users.updateAccessToken(user.id, null);
      ctx.state.user = null;
      ctx.status = 200;
      ctx.body = { message: 'Logout successful' };
      return;
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized: No user found' };
      return;
    }
  }
}

export const authenticate = async (ctx, next) => {
  const authMethod = determineAuthMethod(ctx);

  console.log('authMethod: ', authMethod);
  if (authMethod === "basic") {
    await basicAuth(ctx, next);
  } else if (authMethod === "oauth") {
    console.log('call oauthAuth');
    await authGoogle(ctx, next);
  } else {
    // Handle unsupported authentication method
    ctx.status = 400;
    ctx.body = { error: "Unsupported authentication method" };
    return;
  }
};

// Usage in routes or middleware
export const handleRequest = async (ctx, next) => {
  // Perform authentication
  await authenticate(ctx, next);
};