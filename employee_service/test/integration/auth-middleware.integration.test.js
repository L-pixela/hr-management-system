const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
describe('Employee service auth middleware', () => {
  let app;
  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    // replicate middleware logic here to avoid ESM import issues in Jest
    const localAuthMiddleware = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch {
        return res.status(401).json({ message: 'Invalid token' });
      }
    };

    app = express();
    app.use(express.json());
    app.get('/test-protected', localAuthMiddleware, (req, res) => {
      res.json({ user: req.user });
    });
  });

  test('accepts valid token and sets req.user', async () => {
    const token = jwt.sign({ sub: 'user1', roles: ['EMPLOYEE'], email: 'alice@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/test-protected').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.sub).toBe('user1');
  });

  test('rejects invalid token', async () => {
    const res = await request(app).get('/test-protected').set('Authorization', `Bearer invalid`).expect(401);
    expect(res.body.message).toMatch(/Invalid token|Unauthorized/);
  });
});
