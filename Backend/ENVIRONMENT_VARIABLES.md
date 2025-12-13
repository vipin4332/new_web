# Environment Variables Required for Vercel

## Required Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=tenx_registrations
```

**How to get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Replace `<password>` with your password
6. Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)

### 2. Brevo Email Service
```
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=Tenx Registration
```

### 3. Vercel Blob Storage (Optional but Recommended)
```
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

**How to get Vercel Blob Token:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Vercel Blob is automatically available in serverless functions
3. No token needed if using `@vercel/blob` package

## Important Notes

- Set all variables for **Production**, **Preview**, and **Development** environments
- After adding variables, **redeploy** your project
- MongoDB Atlas free tier allows 512MB storage
- Brevo free tier allows 300 emails/day
- Vercel Blob free tier allows 1GB storage

