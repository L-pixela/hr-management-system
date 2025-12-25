const request = require('supertest');
const app = require('../src/app');
const Performance = require('../src/models/performance.model');
const mongoose = require('mongoose');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
  },
  model: jest.fn(),
  Schema: jest.fn(() => ({
    index: jest.fn(),
  })),
}));

// Mock Performance model
jest.mock('../src/models/performance.model');

describe('Performance Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'Performance Service');
    });
  });

  describe('GET /performance', () => {
    it('should return all performance records', async () => {
      const mockPerformances = [
        {
          _id: '676c1234567890abcdef1234',
          employeeId: 'EMP001',
          score: 85,
          comment: 'Good performance',
          reviewedBy: 'MGR001',
          status: 'approved',
        },
      ];

      Performance.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockPerformances),
        }),
      });

      const response = await request(app)
        .get('/performance')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockPerformances);
    });
  });

  describe('POST /performance', () => {
    it('should create a new performance record', async () => {
      const newPerformance = {
        employeeId: 'EMP001',
        score: 85,
        comment: 'Good performance',
        reviewedBy: 'MGR001',
      };

      const savedPerformance = {
        _id: '676c1234567890abcdef1234',
        ...newPerformance,
        status: 'draft',
        reviewDate: new Date(),
      };

      Performance.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedPerformance),
        ...savedPerformance,
      }));

      const response = await request(app)
        .post('/performance')
        .set('Authorization', 'Bearer mock-token')
        .send(newPerformance)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Performance record created successfully');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/performance')
        .set('Authorization', 'Bearer mock-token')
        .send({ score: 85 }) // Missing employeeId and reviewedBy
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });
});
