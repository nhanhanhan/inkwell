// server/src/routes/__tests__/auth.integration.test.js
//
// Exercise 1: registration and login working together (US-01 + US-02),
// through real HTTP requests against the real app and the test database.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("a newly registered user can log in with the same credentials (US-01 + US-02)", async () => {
  // Arrange + Act: register
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ email: "bob@example.com", displayName: "Bob", password: "correcthorse" });

  expect(registerRes.status).toBe(201);

  // Act: log in with the same credentials
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "bob@example.com", password: "correcthorse" });

  // Assert: login succeeds and identifies the same user
  expect(loginRes.status).toBe(200);
  expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
  expect(loginRes.body.user.email).toBe("bob@example.com");
  expect(loginRes.body.accessToken).toBeDefined();
  expect(loginRes.body.refreshToken).toBeDefined();

  // Regression guard for the Lecture 8 bug: the hash must never leave the server
  expect(loginRes.body.user.passwordHash).toBeUndefined();
});
