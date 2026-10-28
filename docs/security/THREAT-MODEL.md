# Inkwell Threat Model

## Attack Surface
- POST /api/auth/register: unauthenticated, accepts email/displayName/password
- POST /api/auth/login: unauthenticated, accepts email/password
- POST /api/posts: authenticated, accepts title/body/tags
- GET /api/posts: unauthenticated, returns paginated feed
- JWT access tokens: bearer, sent in Authorization header

## STRIDE Analysis, with Risk Rating

| Component | Threat | Category | Likelihood | Impact | Risk Rating | Mitigation |
|---|---|---|---|---|---|---|
| POST /api/posts | A user forges another user's `authorId` to publish as them | Spoofing | High | High | Critical | Derive author from the authenticated token, never trust a client-supplied authorId |
| GET /api/posts | Response includes fields beyond what the feed needs (e.g., email) | Information Disclosure | High | Medium | High | Explicit response shaping with an allowlist DTO |
| POST /api/auth/login | Unlimited login attempts enable brute-force credential guessing | Denial of Service / Broken Auth | Medium | High | High | Rate limiting |
| POST /api/posts | Untrusted `body` content rendered unsanitized on the client, enabling stored XSS | Tampering / Info Disclosure | Medium | High | High | Output encoding on render (React escaping, verified by a regression test) |
| GET /api/posts | An oversized `pageSize` forces a huge database query | Denial of Service | Medium | High | High | Maximum page size (50), invalid values fall back to the default (10) |

## Hardening Log
- 2026-10-28, Lecture 15: Added requireAuth middleware and fixed authorId spoofing on POST /api/posts
- 2026-10-28, Lecture 15: Added allowlist-based user DTO to prevent field leakage in feed and search
- 2026-10-28, Lecture 15: Added rate limiting to login and register endpoints
- 2026-10-28, Lecture 15: Verified stored-XSS resistance with a client regression test
- 2026-10-28, Lecture 15: Capped GET /api/posts pageSize at 50 (Exercise 1)

## Security Measurement Baseline
- Vulnerabilities found this pass: 5 (all remediated)
- Security regression tests: spoofing, unauthenticated/forged token, feed field leakage, and pageSize cap on the server; stored-XSS rendering on the client
- Known gap: the rate limiter itself has no dedicated regression test yet
- Maturity note: Inkwell's security practice is currently ad hoc/reactive (a single hardening pass), not yet an ongoing program. This is the honest, named starting point for future improvement, not a finished state.
