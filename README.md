# 🦊 FoxShare — Secure File Vault

A secure, encrypted file sharing web app built on AWS. Upload, download, share and delete files with full KMS encryption, Cognito authentication, MFA, self-service sign up, forgot password and security hardened headers.

---

## 🌐 Live Demo

> [https://foxshare.vercel.app](https://foxshare.vercel.app)

---

## ✨ Features

- 🔐 **Cognito Authentication** — email and password login with MFA (TOTP)
- 📝 **Self-Service Sign Up** — users register themselves with email verification
- 🔑 **Forgot Password** — Cognito sends a reset code by email automatically
- 🔒 **KMS Encryption** — all files encrypted at rest in S3
- 📁 **File Management** — upload, download, share and delete
- 🔗 **Short Share Links** — automatic TinyURL generation (expires 24hrs)
- 🛡️ **Hidden Credentials** — AWS credentials stored server-side via Vercel Functions, never in HTML
- 🔍 **File Validation** — file type whitelist and 5MB size limit enforced on upload
- 🧱 **Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options via vercel.json
- 🚫 **Restricted CORS** — API only accepts requests from your Vercel domain
- 📱 **Mobile Friendly** — responsive layout with large readable fonts
- 📷 **QR Code Access** — scan to open on mobile

---

## 🏗️ Architecture

```
Browser
   │
   ├── /api/cognito  →  Vercel Function  →  AWS Cognito (sign up, login, MFA, forgot password)
   │
   └── /api/files    →  Vercel Function  →  AWS API Gateway  →  Lambda  →  S3 (KMS encrypted)
```

### AWS Services

| Service | Purpose |
|---|---|
| Cognito | User auth, self-registration, MFA, password reset |
| API Gateway | REST API with Cognito JWT authorizer + throttling |
| Lambda | Upload (with validation), download, list, delete, share |
| S3 | Encrypted file storage — one folder per user |
| KMS | File encryption at rest with auto key rotation |

---

## 👤 User Flows

### Sign Up
```
Click "Sign Up" → Enter email + password
→ Cognito sends verification code by email
→ Enter code → Email verified → Login
→ MFA setup (scan QR code) → Full access
```

### Login
```
Enter email + password → Enter MFA code from authenticator app → Logged in
```

### Forgot Password
```
Click "Forgot Password?" → Enter email
→ Cognito sends 6-digit reset code by email
→ Enter code + new password → Password reset → Login
```

---

## 📁 Project Structure

```
foxshare/
├── index.html              ← Frontend — no AWS credentials
├── package.json            ← Node.js version (24.x)
├── vercel.json             ← Security headers + function config
├── README.md               ← This file
└── api/
    ├── cognito.js          ← Cognito proxy — injects POOL_ID + CLIENT_ID server-side
    └── files.js            ← Files proxy — injects API_URL server-side
```

---

## 🚀 Deployment

### Prerequisites
- AWS account with Cognito, API Gateway, Lambda, S3 and KMS configured
- Cognito User Pool with self-registration enabled and MFA required
- Cognito App Client with **no client secret** and `ALLOW_USER_PASSWORD_AUTH` enabled
- GitHub account
- Vercel account (free tier)

### Step 1 — Upload to GitHub
1. Create a repository named `foxshare`
2. Upload all files including the `api` folder

### Step 2 — Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your `foxshare` GitHub repository

### Step 3 — Add Environment Variables
> ⚠️ Add these BEFORE clicking Deploy

| Key | Where to find it |
|---|---|
| `API_URL` | API Gateway → Stages → Prod → Invoke URL |
| `POOL_ID` | Cognito → User Pools → your pool → Pool ID |
| `CLIENT_ID` | Cognito → App clients → Client ID |
| `ALLOWED_ORIGIN` | Your Vercel URL e.g. `https://foxshare.vercel.app` |

### Step 4 — Deploy
Click **Deploy** — your live URL will be ready in 30–60 seconds.

---

## 🔒 Security

### Implemented
- AWS credentials never in HTML — stored as Vercel environment variables
- `CLIENT_ID` and `POOL_ID` injected server-side by Vercel proxy
- CORS restricted to your Vercel domain only via `ALLOWED_ORIGIN`
- Security headers set via `vercel.json` — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Files stored per user: `users/{email}/{file-id}/{filename}`
- All S3 objects encrypted with AWS KMS
- JWT tokens validated on every Lambda request
- MFA enforced on all accounts via TOTP
- Cross-user file access blocked in all Lambda functions
- S3 bucket fully private — no public access
- File type whitelist enforced on upload Lambda
- 5MB file size limit enforced on upload Lambda
- Filename sanitised before saving to S3

### Recommended Next Steps
- Enable AWS GuardDuty — threat detection
- Enable Cognito advanced security — compromised credential detection
- Enable API Gateway throttling — prevents abuse
- Enable S3 versioning — protects against accidental deletion
- Rotate KMS key annually — enable auto rotation in KMS settings
- Run OWASP ZAP scan against your Vercel URL periodically

## 🛠️ Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Value null at clientId` | Wrong `index.html` or missing `CLIENT_ID` | Ensure `index.html` has no hardcoded credentials. Re-add `CLIENT_ID` in Vercel and redeploy |
| `region is not defined` | `POOL_ID` missing | Add `POOL_ID` in Vercel → Settings → Environment Variables and redeploy |
| `Share failed: Missing env var` | `API_URL` not set | Add `API_URL` in Vercel and redeploy |
| `Origin not allowed` | `ALLOWED_ORIGIN` missing or wrong | Add `ALLOWED_ORIGIN` in Vercel with your exact Vercel URL |
| `Sign up failed` | Self-registration disabled | Cognito → User Pool → Sign-up experience → Enable self-registration |
| File upload rejected | File type not allowed or over 5MB | Check allowed types list in `lambda_upload.py` or reduce file size |
| Login fails | Various | Check Vercel → Logs for exact error |
| Page not found | `index.html` not at repo root | Ensure `index.html` is at root, not inside a subfolder |
| `api` folder missing | Upload issue | Drag the `api` folder directly into GitHub upload area |
| MFA code rejected | Code expired | Wait 30s for next cycle and try again |
| Env vars disappeared | Project deleted and recreated | Re-add all four env vars — they wipe when a project is deleted |
| Changes not live | Vercel still redeploying | Wait 30–60s after committing to GitHub |

---

## 📄 License

This project is for personal/internal use.

---

*Built with AWS · Secured with Vercel · Scanned with OWASP ZAP · March 2026*
