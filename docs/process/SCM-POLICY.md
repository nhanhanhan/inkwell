# Inkwell SCM Policy

## Branching Strategy

Inkwell uses GitHub Flow:

- `main` is always deployable.
- All work happens on short-lived branches named `<type>/<short-description>`,
  such as `feature/tag-search` or `fix/author-id-spoofing`.
- Contributors merge branches through pull requests that require:
  - All automated tests to pass
  - At least one reviewer to approve the change
- Contributors delete branches after merging them.

## Commit Message Conventions

Inkwell follows Conventional Commits:

    <type>(<scope>): <short summary>

Types: feat, fix, test, docs, refactor, chore, security

Examples:

    feat(posts): add tag-based search
    security(auth): fix authorId spoofing vulnerability

A consistent `<type>(<scope>)` prefix makes the project history searchable.
For example, `git log --grep="^security"` quickly finds every security-related
change, which turns the commit history into a useful audit trail.
