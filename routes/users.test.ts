import request from 'supertest';
import Koa from 'koa';
import json from 'koa-json';
import * as usersModel from '../models/users.model';
import { router } from './users';
import { Context } from 'koa';
import { config } from '../config';

const credential: string = config.test_cred;

const app: Koa = new Koa();
app.use(json());
app.use(router.routes());

let server: any;

beforeAll(async () => {
  server = await app.listen(3000);
});

afterAll(async () => {
  await server.close();
});

// All tests should mock the reply from model to avoid messing up data

describe('POST /api/v1/users - create a user', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstname: 'testfirst',
      lastname: 'testlast'
    };
    const expectedResult = {
      success: true,
      message: 'User created successfully'
    };

    const createUserSpy = jest.spyOn(usersModel, 'createUser').mockResolvedValueOnce(expectedResult);

    const response = await request(app.callback())
      .post('/api/v1/users')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: expectedResult.message });
  });

  it('should return an error if user creation fails', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstname: 'testfirst',
      lastname: 'testlast'
    };
    const expectedResult = {
      success: false,
      message: 'Failed to create user'
    };

    const createUserSpy = jest.spyOn(usersModel, 'createUser').mockResolvedValueOnce(expectedResult);

    const response = await request(app.callback())
      .post('/api/v1/users')
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: expectedResult.message });
  });
});


describe('GET /api/v1/users/favorites', () => {
  it('should get the user favorite dogs', async () => {
    const userId = 1;
    const expectedResult = {
      success: true,
      favorites: [
        { dog_id: 1, user_id: userId },
        { dog_id: 2, user_id: userId }
      ]
    };

    // mocking model to test route and make sure there is records for testing
    const getFavoritesSpy = jest.spyOn(usersModel, 'getFavorites').mockResolvedValueOnce(expectedResult);

    const response = await request(app.callback())
      .get('/api/v1/users/favorites')
      .set('Authorization', credential);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ dogIds: [1, 2] });
    expect(getFavoritesSpy).toHaveBeenCalledWith(userId);
  });

  it('should return an error if getting favorites fails', async () => {
    const userId = 1;
    const expectedResult = { success: false, message: 'Error getting favorites' };

    const getFavoritesSpy = jest.spyOn(usersModel, 'getFavorites').mockResolvedValueOnce(expectedResult);

    const response = await request(app.callback())
      .get('/api/v1/users/favorites')
      .set('Authorization', credential);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: expectedResult.message });
    expect(getFavoritesSpy).toHaveBeenCalledWith(userId);
  });
});


