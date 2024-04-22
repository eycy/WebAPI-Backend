import Koa from 'koa';
import json from 'koa-json';
import passport from 'koa-passport';
import { router } from './articles';
import request from 'supertest';

const app: Koa = new Koa();
app.use(json());
app.use(passport.initialize());
app.use(router.middleware());

app.listen(3000);

describe('Get / - a simple api endpoint', ()=> {
  test('Get all article', async ()=>{
    const result = await request(app.callback()).get('/api/v1/articles');
    expect(result.statusCode).toEqual(200);
  })
  it('Get an article with ID 111', async() => {
    const result = await request(app.callback()).get('/api/v1/articles/111');
    expect(result.statusCode).toEqual(404);
  })
})

describe('PUT /api/v1/articles/:id - update an article', () => {
  it('should update an article with the given ID', async () => {
    // Prepare the test data
    const articleId = 1;
    const updatedArticle = {
      title: 'Updated Title',
      allText: 'Updated content',
      authorID: 1
    };

    // Call the update function directly to update the article in the database
    // await update(updatedArticle, articleId);

    // Send a request to the API endpoint to retrieve the updated article
    const response = await request(app.callback())
      .put(`/api/v1/articles/${articleId}`)
      .set('Authorization', 'Basic YWxpY2U6cGFzc3dvcmQ=') // Base64 encoded credentials: Alice:password
      .send(updatedArticle);

    // Assert the response status code
    expect(response.statusCode).toEqual(201);

    // Assert the response body or other aspects of the updated article
    const { title, allText, authorID} = response.body;

    expect(title).toEqual(updatedArticle.title);
    expect(allText).toEqual(updatedArticle.allText);
    expect(authorID).toEqual(updatedArticle.authorID);
  });
});