const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES_IN = '1h';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;

  // require after env set
  app = require('../../src/app');
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth integration', () => {
  const user = { email: 'alice@example.com', password: 'password123' };
  let token;

  test('register -> login -> me -> introspect', async () => {
    const agent = request(app);

    const reg = await agent.post('/auth/register').send(user).expect(201);
    expect(reg.body.email).toBe(user.email);

    const login = await agent.post('/auth/login').send(user).expect(200);
    expect(login.body).toHaveProperty('accessToken');
    token = login.body.accessToken;

    const me = await agent.get('/auth/me').set('Authorization', `Bearer ${token}`).expect(200);
    expect(me.body).toHaveProperty('id');
    expect(me.body).toHaveProperty('roles');

    const introspect = await agent.post('/auth/introspect').send({ token }).expect(200);
    expect(introspect.body.active).toBe(true);
    expect(introspect.body).toHaveProperty('sub');
  });
});
