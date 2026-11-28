---
description: Apply all of Hùng's numbered feedback in one go, run /review, reply with a table.
argument-hint: (paste all feedback, numbered, in one message)
---

Apply this feedback from Hùng:

$ARGUMENTS

Follow `CLAUDE.md`.

1. Read every numbered item before changing anything. If an item is unclear, or would break a hard rule (invented facts, confidentiality, one language only, new component, style change), do not guess: mark it "needs your input" with one short question.
2. Apply every clear item. Content changes go in `content/` (both `<En>` and `<Vi>`, keeping them in step). Design or code changes only if the item asks for them, using existing components and styles.
3. Run `/review` on what changed (follow `.claude/commands/review.md`).
4. Reply with one table, nothing skipped:

   | # | What changed (file and short description) | Status |
   |---|---|---|
   | 1 | … | done / needs your input: <question> |

   Then the review result and the open-items checklist.
5. Do not commit or push unless Hùng says so.
