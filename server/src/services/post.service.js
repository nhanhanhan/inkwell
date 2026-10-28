// server/src/services/post.service.js

import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty } from "../utils/validation.js";
import { SubstringSearchStrategy } from "./search/substring-search.strategy.js";
import { EventBus } from "../events/event-bus.js";

const searchStrategy = SubstringSearchStrategy; // swap this line to change search behavior system-wide

// STRIDE (Denial of Service): without a cap, one request could ask for an
// enormous page and force a huge database query.
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export function clampPageSize(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(n, MAX_PAGE_SIZE);
}

export const PostService = {
  async publish({ authorId, title, body, tagNames = [] }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");

    const post = await PostRepository.createWithTags({
      authorId,
      title,
      body,
      tagNames,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    EventBus.emit("post.published", {
      postId: post.id,
      authorId,
      title: post.title,
      tags: tagNames,
    });

    return post;
  },

  async listPublished({ page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
    const size = clampPageSize(pageSize);
    const { posts, hasMore } = await PostRepository.findPublished({ page, pageSize: size });
    return { posts, page, hasMore };
  },

  async search({ query, page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
    return searchStrategy.search(query, { page, pageSize: clampPageSize(pageSize) });
  },
};
