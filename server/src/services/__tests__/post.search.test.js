// server/src/services/__tests__/post.search.test.js
//
// Exercise 1: test cases for PostService.search() (see docs/quality/SEARCH-TEST-CASES.md)

import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
  findPublished: jest.fn(),
  searchPublished: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));

const { PostService } = await import("../post.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PostService.search", () => {
  test("returns matching posts from the repository (row 1)", async () => {
    const fakePosts = [{ id: "p1", title: "On Modularity" }];
    mockPostRepository.searchPublished.mockResolvedValue({ posts: fakePosts, hasMore: false });

    const result = await PostService.search({ query: "modularity" });

    expect(result.posts).toEqual(fakePosts);
    expect(result.hasMore).toBe(false);
  });

  test("returns an empty list, not an error, when nothing matches (row 2)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

    const result = await PostService.search({ query: "zzz-no-match" });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  test("uses page 1 and page size 10 by default (row 3, boundary)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

    await PostService.search({ query: "x" });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({ query: "x", page: 1, pageSize: 10 });
  });

  test("forwards an explicit page number (row 4, boundary)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

    await PostService.search({ query: "x", page: 2 });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({ query: "x", page: 2, pageSize: 10 });
  });

  test("propagates a repository failure instead of swallowing it (row 5, white-box branch)", async () => {
    mockPostRepository.searchPublished.mockRejectedValue(new Error("db down"));

    await expect(PostService.search({ query: "x" })).rejects.toThrow("db down");
  });
});
