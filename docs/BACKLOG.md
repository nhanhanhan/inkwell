# Inkwell Product Backlog

Definition of Done: see README.md

| ID | User Story | Priority | Points | Status | Notes |
|----|------------|----------|--------|--------|-------|
| US-01 | As a visitor, I want to register an account... | High | 3 | Requirements Defined | See use-cases.md |
| US-02 | As a registered user, I want to log in... | High | 5 | Requirements Defined | See use-cases.md |
| US-03 | As an author, I want to write and publish... | High | 5 | Requirements Defined | Scope negotiated: plain text only |
| US-04 | As a reader, I want to browse a public feed... | High | 3 | Requirements Defined | See use-cases.md |
| US-05 | As a reader, I want to comment on a post... | Medium | 3 | Backlog | |
| US-06 | As a reader, I want to follow an author... | Medium | 3 | Backlog | |
| US-07 | As an author, I want basic analytics... | Low | 5 | Backlog | |
| US-08 | As a registered user, I want to reset my password via email, so that I can regain access if I forget it. | High | 5 | Backlog |
| US-09 | As a reader, I want to search posts by tag, so that I can find writing on topics I care about. | Medium | 3 | Backlog |


## Justifications for New Stories

- **US-08** (5 points): Involves secure token generation, email delivery, and expiration handling — comparable complexity to US-02's auth work.
- **US-09** (3 points): Similar scope to browsing the public feed (US-04), just filtered by an additional field.