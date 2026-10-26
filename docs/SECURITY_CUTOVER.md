# União — cutover to a private Git repository without downtime

## Current state

- GitHub Pages publishes from `main` via `.github/workflows/deploy.yml` (`npm ci && npm run build`, output: `dist`).
- The Vite app uses `HashRouter` and relative `base:'./'`; preserve the full `/#/validar-certificado/USM-...` path on the production domain.
- The repository must **not** be made private until a working replacement has been verified.
- Historical copies of Markdown in public Git commits remain accessible while GitHub repository is public, even though the latest Pages build excludes them.
- Website visitors may still have downloaded/cached older public assets. Repository privacy does not invalidate existing copies.

## Cloudflare Pages (Git integration)

1. In the target Cloudflare account, open Workers & Pages > Create > Pages > Connect to Git.
2. Authorize the official Cloudflare GitHub integration for `arantes225/uniao` only.
3. Select `main` as production branch, build command `npm ci && npm run build`, build output `dist`; no additional secret variables should be required for the static frontend beyond existing publishable configuration.
4. Test preview `https://<new-project>.pages.dev`: landing, login/logout, Google OAuth redirect allow-list, student apostilas (RLS), official exam panel, authenticated admin, TOTP enrollment and verification, certificate QR, storage image URLs, cache behavior and PDF print.
5. Set the final custom domain from Cloudflare Pages > Custom domains. Update DNS only after the preview passes and the matching SSL certificate is active.
6. Update Supabase Auth URL Configuration / Redirect URLs to include the correct HTTPS domain(s); remove unused preview destinations after testing. Verify both OAuth providers and password login.
7. Confirm HTTP redirect to HTTPS and verify the final domain, including a successful login and a QR scan of `/#/validar-certificado/` (a nonexistent code must be rejected).
8. Disable the GitHub Pages workflow only **after** Cloudflare's production site is confirmed, and then change GitHub repository visibility to **Private** in Settings > Danger Zone. Check that Cloudflare's authorized GitHub App still pulls from the private repository.
9. Review public forks and old caches: historic exposure cannot be retroactively erased. Archive/migrate the original Git history only with a backup and after rotating any truly exposed credential.
10. Review the GitHub security audit (Gitleaks) and secret-scanning alerts; public Supabase anon keys do not need revocation just for being public, service_role and other privileged secrets do.

Do not put Cloudflare account keys, billing keys, service_role secrets or TOTP recovery secrets into GitHub files. Prefer Cloudflare account-managed integration and limited-access credentials.

## Remaining manual security setting

In Supabase Dashboard > Authentication > Settings (or the current password security panel), enable leaked-password protection if the project tier offers it. It is independent of application repository changes. Server-enforced AAL2 is now active for certificate issuance, certificate revocation and curriculum attestations. Staff must first complete TOTP enrollment on Admin Dashboard; requests at AAL1 are intentionally rejected. Presence-code generation still requires a staff session but does not currently enforce AAL2.

## Certification controls

- At least 5 reviewed questions (with 4–5 options and exactly one correct answer) must be present before an official assessment can be published.
- Content of a published assessment is frozen. To modify, create a new assessment.
- A certificate must have a valid template, verified attendance, course-completion attestation (where curricula are assigned), and approved official exams.
- The real issuance code comes from `certificate_issuances`; previews are not official and print buttons for unsigned models are disabled.
- Revocation is audited. Never reuse verification codes.
- **Do not** automatically publish demonstration questions as validated medical exams. Scientific and regulatory review belongs to the technical team.
