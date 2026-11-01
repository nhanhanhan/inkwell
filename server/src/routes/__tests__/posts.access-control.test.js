// server/src/routes/__tests__/posts.access-control.test.js
//
// A01 regression tests: authentication is not authorization.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import {
  resetDatabase,
  createTestUser,
  createTestPost,
  tokenFor,
} from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("a user cannot delete another user's post (A01 regression test)", async () => {
  const owner = await createTestUser();
  const attacker = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });

  const res = await request(app)
    .delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(attacker)}`);

  expect(res.status).toBe(403);
  // the post must still exist
  expect(await prisma.post.findUnique({ where: { id: post.id } })).not.toBeNull();
});

test("the owner can delete their own post", async () => {
  const owner = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });

  const res = await request(app)
    .delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(owner)}`);

  expect(res.status).toBe(204);
  expect(await prisma.post.findUnique({ where: { id: post.id } })).toBeNull();
});

test("deleting without a token is rejected with 401", async () => {
  const owner = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });

  const res = await request(app).delete(`/api/posts/${post.id}`);

  expect(res.status).toBe(401);
});

test("deleting a post that does not exist returns 404", async () => {
  const user = await createTestUser();

  const res = await request(app)
    .delete("/api/posts/does-not-exist")
    .set("Authorization", `Bearer ${tokenFor(user)}`);

  expect(res.status).toBe(404);
});
