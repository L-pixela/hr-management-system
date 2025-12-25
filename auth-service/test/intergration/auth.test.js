const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(20000);

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

describe("Auth integration test", () => {
  test("register + login flow", async () => {
    const email = `u${Date.now()}@test.local`;

    await request(app)
      .post("/auth/register")
      .send({
        email,
        password: "password123"
      })
      .expect(201);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "password123"
      })
      .expect(200);

    expect(loginRes.body.accessToken).toBeDefined();
  });
});
