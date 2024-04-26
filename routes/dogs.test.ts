import Koa from 'koa';
import json from 'koa-json';
import passport from 'koa-passport';
import { router } from './dogs';
import request from 'supertest';

const credential: string = 'Basic YWxpY2U6cGFzc3dvcmQ='; // Base64 encoded credentials: Alice:password

const app: Koa = new Koa();
app.use(json());
app.use(passport.initialize());
app.use(router.middleware());

let server; // Declare a variable to store the server instance

beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close(done); // Close the server instance
});


// app.listen(3000);

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

  });
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
  }, 10000); // Increase timeout to 10 seconds
});