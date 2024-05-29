import Koa from 'koa';
import json from 'koa-json';
import passport from 'koa-passport';

const app: Koa = new Koa();

app.use(json());
app.use(passport.initialize());
const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
  mockListen.mockReset();
});

test('Server works', async () => {
  require('./index');
  expect(mockListen.mock.calls.length).toBe(0);
})