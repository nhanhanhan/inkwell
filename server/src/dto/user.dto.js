// server/src/dto/user.dto.js
//
// An allowlist of the user fields that are safe to expose publicly.
// New user fields stay private until someone deliberately adds them here.

export function toPublicUser(user) {
  return {
    id: user.id,
    displayName: user.displayName,
    // deliberately excluded: email, passwordHash, and any future sensitive field
  };
}
