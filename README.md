# FORGE — AI Career Mentor

A React career-development prototype with Firebase authentication, an Express/MongoDB backend and server-side AI requests. The student experience includes career selection, skill-gap guidance, assessments and AI-assisted learning.

## Local setup

Node.js 22 recommended. Install with `npm ci` in the root and `npm install` in `backend`. Run `node server.js` in backend, then `npm start` in root.

Set frontend `REACT_APP_API_URL` to the backend URL. Backend environment variables:

- MONGO_URI
- FIREBASE_WEB_API_KEY (same Firebase project as src/firebase.js)
- ANTHROPIC_API_KEY
- RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (test credentials first)
- ENABLE_PRO_CHECKOUT=false (default; only enable after integration testing)
- PORT (optional)

Never commit private keys or database credentials. Email/password accounts must verify their email.

## Plans and billing

Free: 5 AI requests/day. Pro: 100/day. All AI tools share the UTC daily quota. Pro costs INR 499 for 30 days with no automatic renewal; server-owned orders and captured payments are verified before access is granted. Quotas count attempted provider requests, including failed upstream requests. Mentor profiles, industry portal and job listings remain demonstration features; mentor payments are disabled. Do not offer real paid services until those workflows and advertised benefits have been validated.

## Verification

Run `node --test backend/tests/*.test.cjs` and `npm run build`. CI checks syntax, billing policy and frontend build. Before production: verify Firebase sign-up/login, cross-account access, quota concurrency, MongoDB indexes, Razorpay test checkout and retry/refund/reconciliation flows; configure CORS and monitoring. The prototype is not a production billing service yet.
