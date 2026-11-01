// server/src/lib/logger.js
//
// One shared structured logger, configured once and used everywhere.
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
