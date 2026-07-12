# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-06-29

### Added

- Initial static website project
- Responsive homepage
- Hero section
- Product catalog prototype
- Shopping cart prototype
- Fabric story section
- Fabric care guide section
- Order flow section
- Instagram contact CTA
- SEO meta tags
- GitHub Pages CNAME file
- README.md
- PROJECT_DISCOVERY.md
- ROADMAP.md

### Changed

- N/A

### Fixed

- N/A

### Removed

- N/A
# 2026-07-12 — Checkout hardening and customer self-service

- Persist active pending/payment-reported orders across refreshes.
- Separate temporary reservations from physical stock; deduct only after `paid` confirmation.
- Expire unreviewed payment reports after 24 hours instead of reserving indefinitely.
- Add per-client API rate limits, bot honeypot, and optional Cloudflare Turnstile verification.
- Validate Thai phone numbers and five-digit postal codes in the browser and Apps Script.
- Add an Order ID status lookup and Privacy Policy section.
- Document GitHub Pages HTTPS and CAPTCHA deployment steps.
