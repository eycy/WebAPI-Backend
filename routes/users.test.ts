import request from 'supertest';
import Koa from 'koa';
import json from 'koa-json';
import * as usersModel from '../models/users.model';
import { router } from './users';
import { Context } from 'koa';

const app: Koa = new Koa();
app.use(json());
app.use(router.routes());

describe('POST /api/v1/users - create a user', () => {
  beforeEach(() => {
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