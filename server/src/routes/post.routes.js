// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished()/search() to
// the API contract's POST /api/posts and GET /api/posts.
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { postStats } from "../events/listeners/post-stats.listener.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res) => {
  try {
    // Never trust client-supplied identity: authorId comes from the verified
    // JWT (set by requireAuth), not from the request body.
    const { title, body, tagNames } = req.body;
    const post = await PostService.publish({
      authorId: req.user.id,
      title,
      body,
      tagNames,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      error: { code: err.code || "VALIDATION_ERROR", message: err.message },
    });
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { search } = req.query;
    const page = Math.max(1, Math.floor(Number(req.query.page)) || 1);
    // PostService clamps pageSize to a safe range (see MAX_PAGE_SIZE).
    const pageSize = Number(req.query.pageSize);
    const result = search
      ? await PostService.search({ query: search, page, pageSize })
      : await PostService.listPublished({ page, pageSize });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/stats", (req, res) => {
  res.status(200).json({ totalPublished: postStats.totalPublished });
});

export default router;
