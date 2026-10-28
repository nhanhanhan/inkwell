// server/src/routes/__tests__/security.integration.test.js
//
// Security tests check that the system CANNOT do things we did not intend.
// Earlier functional tests always sent an honest authorId, so they could
// never have caught the spoofing vulnerability.

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

async function registerUser(email, displayName) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, displayName, password: "correcthorse" });
  return res.body; // { user, accessToken, refreshToken }
}

test("publishing without a token is rejected with 401", async () => {
  const res = await request(app)
    .post("/api/posts")
    .send({ title: "No token", body: "Should not be accepted." });

  expect(res.status).toBe(401);
  expect(res.body.error.code).toBe("UNAUTHENTICATED");
});

test("publishing with a forged token is rejected with 401", async () => {
  const res = await request(app)
    .post("/api/posts")
    .set("Authorization", "Bearer not-a-real-token")
    .send({ title: "Forged", body: "Should not be accepted." });

  expect(res.status).toBe(401);
});

test("a user cannot publish as another user by sending that user's authorId (Spoofing)", async () => {
  const alice = await registerUser("alice@example.com", "Alice");
  const bob = await registerUser("bob@example.com", "Bob");

  // Alice sends HER valid token but puts BOB's id in the body.
  const res = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${alice.accessToken}`)
    .send({ authorId: bob.user.id, title: "Spoof attempt", body: "Pretending to be Bob." });

  expect(res.status).toBe(201);
  expect(res.body.authorId).toBe(alice.user.id);
  expect(res.body.authorId).not.toBe(bob.user.id);
});

test("the public feed never exposes author email or passwordHash (Information Disclosure)", async () => {
  const alice = await registerUser("alice@example.com", "Alice");

  await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${alice.accessToken}`)
    .send({ title: "Public post", body: "Hello." });

  const feedRes = await request(app).get("/api/posts?page=1");

  expect(feedRes.status).toBe(200);
  expect(feedRes.body.posts[0].author).toEqual({ id: alice.user.id, displayName: "Alice" });
  expect(JSON.stringify(feedRes.body)).not.toContain("alice@example.com");
  expect(JSON.stringify(feedRes.body)).not.toContain("passwordHash");
});
