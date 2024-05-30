import Koa from 'koa';
import json from 'koa-json';
import passport from 'koa-passport';
import { router } from './dogs';
import request from 'supertest';
import * as model from '../models/dogs.model';
import { config } from '../config';

const credential: string = config.test_cred;


const app: Koa = new Koa();
app.use(json());
app.use(passport.initialize());
app.use(router.middleware());

let server; // Declare a variable to store the server instance

beforeAll(() => {
  server = app.listen(3001);
});

afterAll((done) => {
  server.close(done); // Close the server instance
});


describe('Get / - a simple api endpoint', () => {
  test('Get all dog', async () => {
    const result = await request(app.callback()).get('/api/v1/dogs');
    expect(result.statusCode).toEqual(200);
  })
  it('Get an dog with ID 11111', async () => {
    const result = await request(app.callback()).get('/api/v1/dogs/11111');
    expect(result.statusCode).toEqual(404);
  })
});




describe('POST /api/v1/dogs - create an dog', () => {
  it('should create an dog', async () => {
    // Create a new dog
    const newdog = {
      name: 'test create dog',
      description: 'description of test dog',
      breed_id: 1
    };
    const createddogResponse = await request(app.callback())
      .post('/api/v1/dogs/')
      .set('Authorization', credential)
      .send(newdog);

    // Assert the response
    expect(createddogResponse.statusCode).toEqual(201);

  }, 30000);
});


describe('PUT /api/v1/dogs/:id - update a dog', () => {
  it('should update a dog with the given ID', async () => {
    // Prepare the test data
    const dogId = 1;
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number
    const updateddog = {
      name: `Updated Name ${randomNumber}`,
      description: `Updated content ${randomNumber}`,
      breed_id: 1
    };

    // Retrieve the updated dog
    const response = await request(app.callback())
      .put(`/api/v1/dogs/${dogId}`)
      .set('Authorization', credential)
      .send(updateddog);

    // Assert the response
    expect(response.statusCode).toEqual(201);
  });
});


describe('DELETE /api/v1/dogs/:id - delete an dog', () => {
  it('should delete an dog with the given ID', async () => {
    // Create a new dog for deletion
    const newdog = {
      name: 'dog for delete',
      description: 'description for delete',
      breed_id: 1
    };
    await request(app.callback())
      .post('/api/v1/dogs/')
      .set('Authorization', credential)
      .send(newdog);

    // Retrieve the largest ID from the dogs
    const getAllResponse = await request(app.callback())
      .get('/api/v1/dogs/');
    // .set('Authorization', credential);

    const dogs = getAllResponse.body;
    const largestId = dogs.reduce((maxId, dog) => {
      return dog.id > maxId ? dog.id : maxId;
    }, 0);

    console.log(`largest id: ${largestId}`);

    // Delete the dog with the largest ID
    const response = await request(app.callback())
      .delete(`/api/v1/dogs/${largestId}`)
      .set('Authorization', credential);

    // Assert the response
    expect(response.statusCode).toEqual(200);
  }, 30000); // Increase timeout to 10 seconds
});

describe('GET /api/v1/dogs/search - search with fields', () => {
  beforeEach(() => {

    // Mock the database response
    jest.mock('../models/dogs.model', () => ({
      searchByFields: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a successful call with AND operator', async () => {
    const searchFields = { name: 'test', breed_id: '1', operator: 'AND' };
    const expectedData = [{ id: 1, name: 'Test Dog', breed_id: '1' }];

    jest.spyOn(model, 'searchByFields').mockImplementation(
      async () => {
        // Simulate the resolved value
        return expectedData;
      }
    );

    const response = await request(app.callback())
      .get('/api/v1/dogs/search')
      .query({ ...searchFields, operator: 'AND' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedData);
    expect(model.searchByFields).toHaveBeenCalledWith(searchFields, 'AND');
  });

  it('should make a successful call with OR operator', async () => {
    const searchFields = { name: 'test', breed_id: '1', operator: 'OR' };
    const expectedData = [{ id: 1, name: 'Test Dog', breed_id: '1' }];

    jest.spyOn(model, 'searchByFields').mockImplementation(
      async (searchFields: Record<string, string | number>, operator?: 'AND' | 'OR') => {
        console.log(searchFields);
        console.log(operator);
        return expectedData;
      }
    );

    const response = await request(app.callback())
      .get('/api/v1/dogs/search')
      .query({ ...searchFields, operator: 'OR' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedData);
    expect(model.searchByFields).toHaveBeenCalledWith(searchFields, 'OR');
  });

  it('should make a successful call with no operator (default to AND)', async () => {
    const searchFields = { name: 'test', breed_id: '1' };
    const expectedData = [{ id: 1, name: 'Test Dog', breed_id: '1' }];

    jest.spyOn(model, 'searchByFields').mockImplementation(
      async (searchFields: Record<string, string | number>, operator?: 'AND' | 'OR') => {
        console.log(searchFields);
        console.log(operator);
        return expectedData;
      }
    );

    const response = await request(app.callback())
      .get('/api/v1/dogs/search')
      .query(searchFields);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedData);
    expect(model.searchByFields).toHaveBeenCalledWith({ ...searchFields, breed_id: '1' }, 'AND');
  });

  it('should return status 500 when there is an error', async () => {
    const searchFields = { name: 'test', breed_id: '1', "operator": "AND" };
    const errorMessage = 'An error occurred during the search';

    (model.searchByFields as jest.Mock).mockImplementationOnce(
      async (searchFields: Record<string, string | number>, operator?: 'AND' | 'OR') => {
        console.log(searchFields);
        console.log(operator);
        throw new Error(errorMessage);
      }
    );

    const response = await request(app.callback())
      .get('/api/v1/dogs/search')
      .query({ ...searchFields, operator: 'AND' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
    expect(model.searchByFields).toHaveBeenCalledWith(searchFields, 'AND');
  });

  it('should return status 404 when no dogs are found', async () => {
    const searchFields = { name: 'nonexistent', breed_id: '1', operator: 'AND' };

    jest.spyOn(model, 'searchByFields').mockImplementation(
      async (searchFields: Record<string, string | number>, operator?: 'AND' | 'OR') => {
        console.log(searchFields);
        console.log(operator);
        return [];
      }
    );

    const response = await request(app.callback())
      .get('/api/v1/dogs/search')
      .query({ ...searchFields, operator: 'AND' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual([]);
    expect(model.searchByFields).toHaveBeenCalledWith(searchFields, 'AND');
  });
});