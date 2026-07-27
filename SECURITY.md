# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| main (latest) | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not** open a public issue.

Instead, report it privately:

1. Open a [private security advisory](../../security/advisories/new) on GitHub, **or**
2. Contact the maintainer directly with details of the issue.

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce
- Any relevant logs, screenshots, or proof-of-concept code

We aim to acknowledge reports within a few days and will keep you informed as the issue is investigated and resolved.

## Known Security Considerations

- **`GET /api/report/:id` has no authentication check.** Any analysis ID is fetchable by anyone who knows or guesses it. Add `authMiddleware` to this route before deploying publicly — see [`server/routes/report.js`](server/routes/report.js).
- **No secrets in source control**: this repository ships with `server/.env.example` only. Never commit a real `.env` file. A previous local `.env` for this project contained a live Groq API key and JWT secret — if you ever suspect a key from this project was exposed, rotate it immediately from your provider's dashboard.
- **JWT secret strength**: use a long, random `JWT_SECRET` in production — do not reuse example/demo values.
- **Uploaded files**: resumes and job descriptions are written to `server/uploads/` during processing. This folder is excluded from version control; ensure it's also excluded from any deployment artifact or backup that could expose user documents.
- **CORS**: the server currently allows requests from `http://localhost:3000` only (see `server/server.js`). Update this to your production frontend origin before deploying.

## Disclosure Policy

We follow responsible disclosure practices. Please allow reasonable time for a fix to be released before publicly disclosing any vulnerability.
