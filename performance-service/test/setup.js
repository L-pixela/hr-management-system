// Jest setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/performance_db_test';

// Mock JWT verification for tests
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({
    userId: 'test-user-id',
    email: 'test@example.com',
  })),
  sign: jest.fn(() => 'mock-token'),
}));
