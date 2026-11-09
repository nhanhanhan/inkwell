# server/Dockerfile
#
# Copy package files and install dependencies before copying the source
# code, so Docker can reuse the dependency layer when only source changes.

FROM node:22-alpine
# Alpine is small, but uses musl instead of glibc, so native dependencies
# (like bcrypt) must support it. Node 22 matches server/package.json engines.

ENV NODE_ENV=production
# Production mode: error-handler.js hides internal error details.

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
# Separate cached layer for dependencies.

# The project's Prisma config is named prisma7.config.ts; Prisma looks for
# prisma.config.ts, so it is copied under that name inside the image.
COPY prisma7.config.ts ./prisma.config.ts
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx --no-install prisma generate
# prisma generate does not connect to a database, so a temporary URL is fine
# here. It applies only to this RUN instruction. The real URL is supplied at
# runtime.

COPY src ./src
# Application code last, because it changes most often.

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# Applies pending database migrations before the server starts.

ENV PORT=3000
EXPOSE 3000

USER node
# Run as the unprivileged "node" user from the official image.

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
# Secrets are never stored in the image. Supply them when the container starts.
