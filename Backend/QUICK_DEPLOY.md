# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Steps

### Step 1: Go to Vercel
Visit: https://vercel.com/new?teamSlug=vipin-sainis-projects-5d6aa81e

### Step 2: Import Repository
1. Click **"Import Git Repository"**
2. Select: `vipin4332/new_web`
3. Click **"Import"**

### Step 3: Configure Root Directory
1. In project settings → **Settings** → **General**
2. **Root Directory**: Click **Edit** → Enter `Backend` → **Save**

### Step 4: Add Environment Variables
Go to **Settings** → **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `BREVO_API_KEY` | Your Brevo API key (get from https://app.brevo.com/settings/keys/api) |
| `BREVO_SENDER_EMAIL` | Your verified Brevo email |
| `BREVO_SENDER_NAME` | `Tenx Registration` |
| `NODE_ENV` | `production` |

**Important**: Add these for **Production**, **Preview**, and **Development** environments.

### Step 5: Deploy
Click **"Deploy"** and wait 1-2 minutes.

## 📝 After Deployment

1. **Get your Vercel URL**: `https://your-project.vercel.app`

2. **Update Frontend**: 
   - Open `registration-form.html` (in root directory)
   - Find: `const API_BASE_URL = 'http://localhost:5000';`
   - Replace with: `const API_BASE_URL = 'https://your-project.vercel.app';`

3. **Test API**:
   - Health: `https://your-project.vercel.app/api/health`
   - Send OTP: `https://your-project.vercel.app/api/send-otp`

## ✅ Done!

Your backend is now live and ready to send OTP emails!

