# OWASP Top 10 Review (Lecture 16)

| # | Category | Status in Inkwell | Action |
|---|---|---|---|
| A01 | Broken Access Control | Found: a delete endpoint would have checked login but not ownership | Fixed: DELETE /api/posts/:id returns 403 unless the post's author is the logged-in user; regression test in posts.access-control.test.js |
| A02 | Cryptographic Failures | Passwords already hashed with bcrypt (Lecture 6); found: JWT secrets fell back to hardcoded strings | Fixed: random 256-bit secrets generated with openssl, stored only in the gitignored .env; .env.example documents the variables |
| A03 | Injection | Prisma's parameterized queries prevent SQL injection by default; verified, not fixed | No action needed, verified only |
| A04 | Insecure Design | Covered by Lecture 15's threat model; no new gap found this pass | No action needed |
| A05 | Security Misconfiguration | Found: error responses exposed internal error messages | Fixed: errorHandler returns a generic message in production and logs details internally; regression test in error-handler.test.js |
| A06 | Vulnerable/Outdated Components | npm audit found server 27 (1 critical, 5 high) and client 10 (4 high) | Fixed with npm audit fix: server now 19 (0 high, 0 critical), client now 6 (0 high). See "Residual findings" below |
| A07 | Authentication Failures | Rate limiting already added (Lecture 15) | No new action needed |
| A08 | Software/Data Integrity | Deferred: full treatment in the Lecture 20/21 pipeline integrity discussion | Deferred, flagged |
| A09 | Logging/Monitoring Failures | Found: no logging of failed login attempts | Fixed: pino structured log event "auth.login.failed" with the email, on every failed login |
| A10 | SSRF | Not yet applicable: no feature fetches a user-supplied URL; flagged for when avatar-by-URL is built | Flagged for future work |

## Residual findings (A06)

After npm audit fix, only moderate and low severity findings remain, all in development-time tooling, none in code that runs in production:
- Server (19: 16 moderate, 3 low): deepmerge, glob and minimatch inside Jest's own tool chain. The only automatic fix (npm audit fix --force) would downgrade Jest to version 25, which would break the project's ESM test setup, so it was deliberately not applied.
- Client (6 moderate): minimatch inside ESLint's tool chain. No fix is currently available.
- Decision: accepted and documented. Re-check with npm audit when Jest and ESLint publish patched releases.

## Notes
- npm audit fix was never run with --force, to avoid downgrading pinned dependencies such as Prisma 7 and Jest 30.
- Secrets are never committed: .env and .env.test are gitignored; only .env.example with placeholders is tracked.
