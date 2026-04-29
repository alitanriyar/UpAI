# Security Specification - UpAI

## 1. Data Invariants
- A user can only access their own profile, alarms, and history.
- Alarms must belong to the user of the parent collection.
- Stats are tracked per user and updated only by that user.
- Terminating statuses (like subscription logic) must be protected.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to create a user profile for a different UID.
2. **Key Poisoning**: Inject `isAdmin: true` into the `users` document.
3. **Email Spoofing**: Attempt to update another user's email.
4. **Relational Break**: Create an alarm with a `userId` that doesn't match the path.
5. **Timestamp Bypass**: Create a document with a client-side `createdAt` date from the future.
6. **Enum Poisoning**: Set `difficulty` to `super-hard`.
7. **Size Attack**: Send a `name` field that is 1MB in size.
8. **Shadow Field**: Send `verified: true` in an onboarding update.
9. **History Tampering**: Attempt to update an immutable history record.
10. **Global Read Scan**: Attempt to list all users.
11. **Orphaned Write**: Create an alarm for a user that doesn't exist yet (not applicable here as path implies existence).
12. **Status Shortcut**: Set `subscriptionStatus: 'pro'` without through a payment "Action".

## 3. The Test Runner Plan
We will verify that:
- `create` on users fails if `createdAt != request.time`.
- `update` fails if any keys outside the allowed sync set are modified.
- `write` on stats fails if `updatedAt` is not server timestamp.
