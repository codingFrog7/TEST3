# Security Specification: Agro Sathi Firestore Rules

## 1. Data Invariants
1. **Identity & Ownership**: Any `scout_records`, `field_notes`, and `farmer_profiles` record must have `userId == request.auth.uid`. A farmer cannot create, update, or delete records belonging to another farmer.
2. **Path Variable Hardening**: All collection document IDs (`recordId`, `noteId`, `userId`) must be validated with `isValidId(id)`.
3. **Temporal Integrity**: All `createdAt` fields must be assigned strictly via `request.time` on create, and remain immutable.
4. **Volumetric Boundaries**:
   - `crop`: string <= 50 chars
   - `disease`: string <= 100 chars
   - `scientific`: string <= 100 chars
   - `severity`: number >= 1 and <= 5
   - `remedy`: string <= 500 chars
   - `note`: string <= 1000 chars
   - `authorName`: string <= 100 chars
   - `displayName`: string <= 100 chars
   - `location`: string <= 100 chars
5. **Secure Queries**: Clients querying `/scout_records` and `/field_notes` must filter by `userId == request.auth.uid`. Blanket reads without user identity are rejected.
6. **Immortal Fields**: Once created, `userId` and `createdAt` cannot be changed on update.

## 2. The Dirty Dozen Payloads
1. **Ghost Field Poisoning**: Inserting extra unauthorized admin fields `{ "isAdmin": true, ... }` on a scout record -> REJECTED.
2. **Identity Spoofing**: Creating a note with `userId: "victim_farmer_uid"` while authenticated as `"attacker_uid"` -> REJECTED.
3. **Huge String Attack (Denial of Wallet)**: Submitting a 5MB payload for `note` exceeding 1000 characters -> REJECTED.
4. **Invalid Severity Rating**: Submitting `severity: 99` or `severity: -1` -> REJECTED.
5. **Timestamp Manipulation**: Providing client-side timestamp in the past or future instead of `request.time` -> REJECTED.
6. **Path Traversal / Junk Document ID**: Attempting to write to document ID `../../etc/shadow` or a 2KB junk character string -> REJECTED by `isValidId()`.
7. **Unauthenticated Write**: Creating a scout record without Firebase Auth session (`request.auth == null`) -> REJECTED.
8. **Unverified Email (if enforced)**: Writing without verified email -> REJECTED.
9. **Blanket Query Scraping**: Running a collection query on `/scout_records` without `where("userId", "==", auth.uid)` -> REJECTED.
10. **Foreign Profile Write**: Attempting to update `/farmer_profiles/{otherUser}` -> REJECTED.
11. **Immutable Key Mutation**: Updating an existing scout record to change its `userId` or `createdAt` -> REJECTED.
12. **Catch-All Probe**: Attempting to read or write to arbitrary undeclared collections `/admins` or `/system` -> REJECTED by default deny.

## 3. Test Runner
The security tests verify that all dirty dozen payloads return `PERMISSION_DENIED`.
