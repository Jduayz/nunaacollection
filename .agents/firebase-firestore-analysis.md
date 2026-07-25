# Firestore codebase analysis

Date: 2026-07-25

## Existing application

- Static HTML/CSS/JavaScript hosted from the repository.
- Storefront logic is in `assets/js/app.js`.
- Current backend is Google Apps Script in `google-apps-script/Code.gs`.
- Current admin dashboard is `admin.html` plus `assets/js/admin.js`.
- No Firebase SDK, Firestore collection path, Firestore query, or Firebase
  Authentication flow existed before this bootstrap.

## Current Firestore access model

- No active collections.
- No `where`, `orderBy`, `limit`, or realtime listener queries.
- No Firestore creates, reads, updates, or deletes.
- Initial rules deny every mobile/web client request.

## Planned domain paths (not active)

The intended future model includes orders, product variants, inventory
movements, admin profiles, notification device tokens, and payment-slip
metadata. These paths must not be opened until their schemas, ownership rules,
server-only fields, transitions, and size/type constraints are documented and
tested.

## Authentication

- Email/password is the requested provider.
- The client module exposes sign-in, sign-out, password reset, and auth-state
  observation.
- There is intentionally no public sign-up function.
- Admin authorization is not implemented yet; authentication alone must not
  grant access to orders, customer PII, stock mutations, or slip files.

## Security decision

Keep Firestore at default deny during bootstrap. Add each collection together
with validator functions, immutable ownership/authority fields, least-privilege
rules, and emulator tests in the same change.
