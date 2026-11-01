// server/src/middleware/error-handler.js
//
// A05 fix: never expose stack traces or internal error details to the client
// in production. Details are logged internally instead (A09).
import { logger } from "../lib/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error({ err }, "Unhandled request error");
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: isProd ? "Something went wrong." : err.message,
    },
  });
}
