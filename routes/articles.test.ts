import Koa from 'koa';
import json from 'koa-json';
import passport from 'koa-passport';
import { router } from './articles';
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
  test('Get all article', async () => {
    const result = await request(app.callback()).get('/api/v1/articles');
    expect(result.statusCode).toEqual(200);
  })
  it('Get an article with ID 111', async () => {
    const result = await request(app.callback()).get('/api/v1/articles/111');
    expect(result.statusCode).toEqual(404);
  })
});




describe('POST /api/v1/articles - create an article', () => {
  it('should create an article', async () => {
    // Create a new article
    const newArticle = {
      title: 'Article for unit test creation',
      allText: 'Content for unit test creation',
      authorID: 1
    };
    const createdArticleResponse = await request(app.callback())
      .post('/api/v1/articles/')
      .set('Authorization', credential)
      .send(newArticle);

    // Assert the response
    expect(createdArticleResponse.statusCode).toEqual(201);

  });
});


describe('PUT /api/v1/articles/:id - update an article', () => {
  it('should update an article with the given ID', async () => {
    // Prepare the test data
    const articleId = 1;
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number
    const updatedArticle = {
      title: `Updated Title ${randomNumber}`,
      allText: `Updated content ${randomNumber}`,
      authorID: 1
    };

    // Retrieve the updated article
    const response = await request(app.callback())
      .put(`/api/v1/articles/${articleId}`)
      .set('Authorization', credential)
      .send(updatedArticle);

    // Assert the response
    expect(response.statusCode).toEqual(201);
  });
});


describe('DELETE /api/v1/articles/:id - delete an article', () => {
  it('should delete an article with the given ID', async () => {
    // Create a new article for deletion
    const newArticle = {
      title: 'Article for delete',
      allText: 'Content for delete',
      authorID: 1
    };
    await request(app.callback())
      .post('/api/v1/articles/')
      .set('Authorization', credential)
      .send(newArticle);

    // Retrieve the largest ID from the articles
    const getAllResponse = await request(app.callback())
      .get('/api/v1/articles/');
    // .set('Authorization', credential);

    const articles = getAllResponse.body;
    const largestId = articles.reduce((maxId, article) => {
      return article.id > maxId ? article.id : maxId;
    }, 0);

    console.log(`largest id: ${largestId}`);

    // Delete the article with the largest ID
    const response = await request(app.callback())
      .delete(`/api/v1/articles/${largestId}`)
      .set('Authorization', credential);

    // Assert the response
    expect(response.statusCode).toEqual(200);
    }, 10000); // Increase timeout to 10 seconds
  });