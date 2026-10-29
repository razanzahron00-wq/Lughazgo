# Security Specification & Test Payloads

## 1. Data Invariants
- **User Profile Isolation**: Users may only create and update their own document matching `request.auth.uid`. Users cannot self-escalate to `role: 'admin'`.
- **System & Admin Puzzles**: Only verified admins can create, update, or delete puzzle questions in `/puzzles/{puzzleId}`.
- **Score Integrity**: Game scores in `/game_scores/{scoreId}` must have `userId` strictly matching the submitter's `request.auth.uid`.
- **Global Catch-All**: All unmapped paths default to `read: false, write: false`.

## 2. The Dirty Dozen Payloads (Rejection Matrix)
1. **Ghost Field in User**: Payload containing `isSuperuser: true` on user document creation.
2. **Role Escalation**: Regular user setting `role: 'admin'` during user profile write.
3. **Impersonated Score Submission**: Submitting a score with `userId: 'victim_uid'` while authenticated as `'attacker_uid'`.
4. **Unauthorized Puzzle Tampering**: Non-admin attempting to create or edit a puzzle in `/puzzles/{puzzleId}`.
5. **ID Poisoning in Users**: Path with 2KB string for `{userId}`.
6. **Negative or NaN XP Attack**: Updating user XP with a negative number or arbitrary string.
7. **Blanket Query Scraping**: Attempting an unbounded query on protected collections without proper constraints.
8. **Admin Record Self-Creation**: Unauthenticated or normal user creating a document in `/admins/{adminId}`.
9. **Unauthenticated Puzzle Read**: Anonymous or unauthenticated request to fetch learning puzzles.
10. **Tampering with Immortal Creation Time**: Changing `createdAt` on an existing score document.
11. **Excessive Field Injection**: Exceeding 1000 characters in puzzle title or text.
12. **Foreign Email Spoofing**: Attempting admin operations with an unverified or forged email token.
