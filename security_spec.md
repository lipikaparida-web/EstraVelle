# Security Specification for EstraVelle (PCOD Tracking App)

## 1. Data Invariants
- A Log must always belong to the authenticated user specified in the path.
- Private PII (`/users/{userId}/private/info`) can only be read or written by the user themselves.
- Posts can be read by any authenticated user, but only modified by the author.
- Comments are tied to a post; deleting a post should (ideally) delete comments, but rules will protect them.
- Users cannot change their `authorId` or `createdAt` once a post/comment is created.

## 2. The "Dirty Dozen" Payloads (Targeting Rejection)

1. **Identity Spoofing**: Create a post with `authorId` of another user.
2. **PII Leak**: Non-admin/Non-owner attempting to read `/users/{victimId}/private/info`.
3. **Ghost Field Update**: Updating a log with `isAdmin: true`.
4. **State Shortcutting**: Updating `likesCount` on a post directly (should be handled via specific increment action or restricted).
5. **Resource Poisoning**: Document ID with 2KB data.
6. **Type Mismatch**: `weight` as a string in private info.
7. **Size Violation**: `mood` with a 1MB string.
8. **Unauthorized Deletion**: User A deleting User B's post.
9. **Creation Time Spoofing**: `createdAt` set to a future date by client.
10. **Array Overload**: `symptoms` array with 10,000 items.
11. **Relational Sync Break**: Creating a comment on a non-existent post.
12. **Public PII Access**: Listing all `/users` to scrape emails (PII is isolated, so this should fail).

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these scenarios using the Firebase Emulators. Since I'm in a live environment, I'll focus on the rules implementation.

---

## Firestore Rules Helpers (Phase 3 Primitives)

```javascript
function isValidId(id) { 
  return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); 
}
function incoming() { return request.resource.data; }
function existing() { return resource.data; }
function isSignedIn() { return request.auth != null; }
function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
```
