---
description: "Stage all changes and create a git commit with an AI-generated Conventional Commit message relevant to the staged files"
name: "git-add-commit"
argument-hint: "Optional context for commit intent (e.g., 'finalize docs for release')"
agent: "agent"
---
Perform these steps in order:

1. Inspect repository status and changed files.
2. Stage all current changes with `git add -A`.
3. Review the staged diff with `git diff --cached`.
4. Generate a Conventional Commit message that matches the staged changes.

Conventional Commit rules:
- Use format: `<type>(<scope>): <subject>`.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.
- Use a short, specific subject in imperative mood.
- Choose scope from the most relevant top-level area (for example: `readme`, `content`, `navigation`, `build`, `deps`, `github`).
- If multiple unrelated areas changed, omit scope instead of forcing a misleading one.

Message quality rules:
- The message must be derived from actual staged file changes.
- Prefer the dominant intent of the diff.
- Include optional user argument context if provided, but do not fabricate changes.

5. Commit using the generated message with `git commit -m "<message>"`.
6. Return a short summary including:
- Final commit message
- Files included in the commit
- Commit hash

Failure handling:
- If there are no changes to stage, report that no commit was created.
- If commit fails due to missing git identity, report the exact git error and suggest setting `user.name` and `user.email`.
