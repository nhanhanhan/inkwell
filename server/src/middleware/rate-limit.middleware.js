// server/src/middleware/rate-limit.middleware.js
import rateLimit from "express-rate-limit";

// Security requirement: reject repeated auth attempts from one client within
// ten minutes. Default is 5; tests and local E2E runs raise it via
// AUTH_RATE_LIMIT_MAX so they don't trip their own limiter.
const MAX_ATTEMPTS = Number(process.env.AUTH_RATE_LIMIT_MAX) || 5;

export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: MAX_ATTEMPTS,
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});
