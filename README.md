# 🦊 FoxShare — Secure File Vault

A secure, encrypted file sharing web app built on AWS. Upload, download, share and delete files with full KMS encryption, Cognito authentication, MFA protection and self-service sign up.

---

## 🌐 Live Demo

> [https://foxshare.vercel.app](https://foxshare.vercel.app)

---

## ✨ Features

- 🔐 **Cognito Authentication** — email and password login with MFA
- 📝 **Self-Service Sign Up** — users can register themselves with email verification
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
   ├── /api/cognito  →  Vercel Function  →  AWS Cognito (login, sign up, MFA)
   │
   └── /api/files    →  Vercel Function  →  AWS API Gateway  →  Lambda  →  S3
```

### AWS Services Used

| Service | Purpose |
|---|---|
| Cognito | User authentication, self-registration and MFA |
| API Gateway | REST API endpoint |
| Lambda | Backend file operations |
| S3 | Encrypted file storage |
| KMS | File encryption at rest |

---

## 👤 User Sign Up Flow

```
User clicks "Sign Up"
       ↓
Enters email + password
       ↓
Cognito sends 6-digit verification code by email
       ↓
User enters code → email verified
       ↓
User logs in → prompted to set up MFA
       ↓
Scans QR code with Google Authenticator or Authy
       ↓
Enters 6-digit code → MFA confirmed
       ↓
Full access to private file vault
```

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
- Cognito User Pool with **self-registration enabled**
- GitHub account
- Vercel account (free tier)

### Step 1 — Upload to GitHub
Upload all files to a GitHub repository including the `api` folder.

### Step 2 — Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository

### Step 3 — Add Environment Variables
Add these **before** deploying:

| Key | Description |
|---|---|
| `API_URL` | Your API Gateway Invoke URL |
| `POOL_ID` | Your Cognito User Pool ID |
| `CLIENT_ID` | Your Cognito App Client ID |

### Step 4 — Deploy
Click **Deploy** and wait 30–60 seconds.

---

## 💻 Local Development

For local testing use `index-local.html` with a Python HTTP server.

> ⚠️ Never commit `index-local.html` to GitHub — it contains hardcoded credentials.

```bash
cd Downloads
python -m http.server 3000
```

Open `http://localhost:3000/index-local.html`

---

## 🔒 Security

- AWS credentials stored as Vercel environment variables — never in the HTML
- All Cognito calls proxied through Vercel — `CLIENT_ID` and `POOL_ID` never exposed to browser
- Files stored under each user's email path in S3: `users/{email}/{file-id}/{filename}`
- All S3 objects encrypted with AWS KMS
- JWT tokens from Cognito validated on every API request
- MFA enforced on all user accounts via TOTP
- Cross-user file access blocked in all Lambda functions

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `region is not defined` | Re-add environment variables in Vercel → Settings → Environment Variables, then redeploy |
| `Value null at clientId` | Check `CLIENT_ID` env var is set in Vercel and redeploy. Ensure `index.html` is the Vercel version not the local version |
| `Share failed: Missing env var` | Re-add all three env vars in Vercel and redeploy |
| Login fails after deploy | Go to Vercel → Logs to see the exact error |
| Sign up not working | Enable self-registration in Cognito → User Pool → Sign-up experience |
| Page not found | Ensure `index.html` is at the root of the repo not inside a subfolder |
| api folder missing on GitHub | Go to GitHub → Add file → Upload files and drag the api folder directly |
| MFA code rejected | Wait for the next 30-second cycle and try a fresh code |
| Changes not showing | Wait 30–60 seconds after committing to GitHub for Vercel to redeploy |

---

## 📄 License

This project is for personal/internal use.

---

*Built with AWS · Deployed on Vercel · March 2026*
