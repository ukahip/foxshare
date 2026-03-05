# 🦊 FoxShare — Secure File Vault

A secure, encrypted file sharing web app built on AWS. Upload, download, share and delete files with full KMS encryption, Cognito authentication and MFA protection.

---

## 🌐 Live Demo

> [https://foxshare.vercel.app](https://foxshare.vercel.app)

---

## ✨ Features

- 🔐 **Cognito Authentication** — email and password login with MFA
- 🔒 **KMS Encryption** — all files encrypted at rest in S3
- 📁 **File Management** — upload, download, share and delete
- 🔗 **Short Share Links** — automatic TinyURL generation for shared files
- 🛡️ **Hidden Credentials** — AWS credentials stored server-side via Vercel Functions, never exposed in HTML
- 📱 **QR Code Access** — scan to open on mobile

---

## 🏗️ Architecture

```
Browser
   │
   ├── /api/cognito  →  Vercel Function  →  AWS Cognito (login + MFA)
   │
   └── /api/files    →  Vercel Function  →  AWS API Gateway  →  Lambda  →  S3
```

### AWS Services Used

| Service | Purpose |
|---|---|
| Cognito | User authentication and MFA |
| API Gateway | REST API endpoint |
| Lambda | Backend file operations |
| S3 | Encrypted file storage |
| KMS | File encryption at rest |

---

## 📁 Project Structure

```
foxshare/
├── index.html              ← Frontend — no credentials
├── package.json            ← Node.js version config
├── vercel.json             ← Vercel function settings
└── api/
    ├── cognito.js          ← Cognito proxy function
    └── files.js            ← Files proxy function
```

---

## 🚀 Deployment

### Prerequisites
- AWS account with Cognito, API Gateway, Lambda and S3 configured
- GitHub account
- Vercel account (free tier)

### Step 1 — Clone or upload to GitHub

Upload all files to a GitHub repository including the `api` folder.

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository

### Step 3 — Add Environment Variables

In the Vercel configuration screen add these before deploying:

| Key | Description |
|---|---|
| `API_URL` | Your API Gateway Invoke URL |
| `POOL_ID` | Your Cognito User Pool ID |
| `CLIENT_ID` | Your Cognito App Client ID |

### Step 4 — Deploy

Click **Deploy** and wait 30–60 seconds. Vercel provides a live URL automatically.

---

## 💻 Local Development

For local testing, use the hardcoded version with a Python HTTP server.

> ⚠️ Never commit the local version to GitHub — it contains credentials.

```bash
cd Downloads
python -m http.server 3000
```

Then open `http://localhost:3000/index-local.html`

---

## 🔒 Security

- AWS credentials are stored as Vercel environment variables — never in the HTML
- Files are stored under each user's email path in S3: `users/{email}/{file-id}/{filename}`
- All S3 objects are encrypted with AWS KMS
- JWT tokens from Cognito are validated on every API request
- MFA is enforced on all user accounts via TOTP (Google Authenticator / Authy)

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `region is not defined` | Re-add environment variables in Vercel → Settings → Environment Variables, then redeploy |
| `Share failed: Missing env var` | Same as above — env variables were wiped, re-add all three |
| Login fails after deploy | Go to Vercel → Logs to see the exact error |
| Page not found | Ensure `index.html` is at the root of the repo, not inside a subfolder |
| MFA code rejected | Wait for the next 30-second cycle and try a fresh code |

---

## 📄 License

This project is for personal/internal use.

---

*Built with AWS · Deployed on Vercel · March 2026*
