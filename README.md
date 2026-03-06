# 🦊 FoxShare — Secure File Vault

A secure, encrypted file sharing web app built on AWS. Upload, download, share and delete files with full KMS encryption, Cognito authentication, MFA protection, self-service sign up and forgot password.

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
- 🔗 **Short Share Links** — automatic TinyURL generation for shared files (expires 24hrs)
- 🛡️ **Hidden Credentials** — AWS credentials stored server-side via Vercel Functions, never exposed in HTML source
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
| API Gateway | REST API with Cognito JWT authorizer |
| Lambda | Upload, download, list, delete, share functions |
| S3 | Encrypted file storage per user |
| KMS | File encryption at rest |

---

## 👤 User Flows

### Sign Up
```
Click "Sign Up" → Enter email + password → Cognito sends verification code
→ Enter code → Email verified → Login → MFA setup → Full access
```

### Login
```
Enter email + password → Enter MFA code from authenticator app → Logged in
```

### Forgot Password
```
Click "Forgot Password?" → Enter email → Cognito sends reset code
→ Enter code + new password → Password reset → Login
```

---

## 📁 Project Structure

```
foxshare/
├── index.html              ← Frontend — no AWS credentials
├── package.json            ← Node.js version (24.x)
├── vercel.json             ← Vercel function settings
└── api/
    ├── cognito.js          ← Cognito proxy — injects POOL_ID + CLIENT_ID server-side
    └── files.js            ← Files proxy — injects API_URL server-side
```

---

## 🚀 Deployment

### Prerequisites
- AWS account with Cognito, API Gateway, Lambda, S3 and KMS configured
- Cognito User Pool with self-registration enabled and MFA required
- Cognito App Client with no client secret and `ALLOW_USER_PASSWORD_AUTH` enabled
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

### Step 4 — Deploy
Click **Deploy** — your live URL will be ready in 30–60 seconds.

---

## 💻 Local Development

Use `index-local.html` with a Python HTTP server for local testing.

> ⚠️ Never commit `index-local.html` to GitHub — it contains hardcoded credentials.

```bash
cd Downloads
python -m http.server 3000
```

Open: `http://localhost:3000/index-local.html`

| File | Use for | Credentials |
|---|---|---|
| `index.html` | Vercel deployment | ❌ None |
| `index-local.html` | Local testing only | ✅ Hardcoded |

---

## 🔒 Security

- AWS credentials never appear in HTML source — stored as Vercel environment variables
- `CLIENT_ID` and `POOL_ID` injected server-side by Vercel proxy
- Files stored per user: `users/{email}/{file-id}/{filename}`
- All S3 objects encrypted with AWS KMS
- JWT tokens validated on every Lambda request
- MFA enforced on all accounts via TOTP (Google Authenticator / Authy)
- Cross-user file access blocked in all Lambda functions
- S3 bucket is fully private — no public access

---

## 🛠️ Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Value null at clientId` | Wrong `index.html` version or missing `CLIENT_ID` env var | Ensure `index.html` has no hardcoded credentials. Re-add `CLIENT_ID` in Vercel and redeploy |
| `region is not defined` | `POOL_ID` env var missing | Add `POOL_ID` in Vercel → Settings → Environment Variables and redeploy |
| `Share failed: Missing env var` | `API_URL` not set | Add `API_URL` in Vercel and redeploy |
| `Sign up failed` | Self-registration disabled | Cognito → User Pool → Sign-up experience → Enable self-registration |
| Login fails | Various | Check Vercel → Logs for exact error |
| Page not found | `index.html` not at repo root | Ensure `index.html` is at root, not inside a subfolder |
| `api` folder missing | Upload issue | Drag the `api` folder directly into GitHub upload area |
| MFA code rejected | Code expired | Wait 30s for next cycle and try again |
| Env vars disappeared | Project deleted and recreated | Re-add all three env vars — they wipe when a project is deleted |
| Changes not live | Vercel still redeploying | Wait 30–60s after committing to GitHub |

---

## 📄 License

This project is for personal/internal use.

---

*Built with AWS · Deployed on Vercel · March 2026*
