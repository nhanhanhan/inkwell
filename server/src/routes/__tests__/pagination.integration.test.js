// server/src/routes/__tests__/pagination.integration.test.js
//
// STRIDE Denial of Service mitigation: an oversized pageSize must be clamped,
// never passed through to the database.

import request from "supertest";
import { jest } from "@jest/globals";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { PostRepository } from "../../repositories/post.repository.js";
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "../../services/post.service.js";

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

function spyOnFindPublished() {
  return jest
    .spyOn(PostRepository, "findPublished")
    .mockResolvedValue({ posts: [], hasMore: false });
}

test("an oversized pageSize is clamped to the maximum", async () => {
  const spy = spyOnFindPublished();

  const res = await request(app).get("/api/posts?page=1&pageSize=100000");

  expect(res.status).toBe(200);
  expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: MAX_PAGE_SIZE });
});

test("a non-numeric or non-positive pageSize falls back to the default", async () => {
  const spy = spyOnFindPublished();

  for (const bad of ["abc", "0", "-5"]) {
    spy.mockClear();
    const res = await request(app).get(`/api/posts?page=1&pageSize=${bad}`);
    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }
});

test("a pageSize within the limit is respected", async () => {
  const spy = spyOnFindPublished();

  const res = await request(app).get("/api/posts?page=1&pageSize=20");

  expect(res.status).toBe(200);
  expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
});
