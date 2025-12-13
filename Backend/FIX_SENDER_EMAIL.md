# Fix "Valid Sender Email Required" Error

## The Problem
You're getting: `"valid sender email required"` error from Brevo.

## The Solution

### Step 1: Verify Sender Email in Brevo
1. Go to [Brevo Dashboard](https://app.brevo.com/settings/senders)
2. Click **"Add a sender"** (if you haven't already)
3. Enter your email address (e.g., `your-email@gmail.com`)
4. Enter your name (e.g., `Tenx Registration`)
5. Click **"Save"**
6. **VERIFY THE EMAIL** - Check your inbox for a verification email from Brevo
7. Click the verification link in the email

### Step 2: Set Environment Variable in Vercel
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find `BREVO_SENDER_EMAIL` or add it if it doesn't exist
4. Set the value to your **verified Brevo email** (the one you just verified)
   - Example: `your-email@gmail.com`
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Test Again
Try sending an OTP again - it should work now!

## Important Notes

- The sender email **MUST** be verified in Brevo before it can be used
- The email in Vercel environment variables **MUST** match the verified email in Brevo
- After changing environment variables, you **MUST** redeploy for changes to take effect

## Current Environment Variables Needed

Make sure these are set in Vercel:
- `BREVO_API_KEY` = Your Brevo API key (get from https://app.brevo.com/settings/keys/api)
- `BREVO_SENDER_EMAIL` = `your-verified-email@example.com` ⚠️ **SET THIS!**
- `BREVO_SENDER_NAME` = `Tenx Registration`
- `NODE_ENV` = `production`

