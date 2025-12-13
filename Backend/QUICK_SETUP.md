# Quick MongoDB Setup with Your Credentials

## Your MongoDB Credentials
- **Username:** `vs9953682@_db_user`
- **Password:** `fYuMLJcGRCIVG54c`

## Quick Steps

### 1. Get Your Cluster URL from MongoDB Atlas

1. Login to https://cloud.mongodb.com
2. Click on your cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string (example):
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
5. Note the cluster part: `cluster0.abc123.mongodb.net` (yours will be different)

### 2. Create Full Connection String

Replace the placeholders with your credentials:

```
mongodb+srv://vs9953682@_db_user:fYuMLJcGRCIVG54c@YOUR_CLUSTER_URL.mongodb.net/?retryWrites=true&w=majority
```

**Example (replace with your actual cluster URL):**
```
mongodb+srv://vs9953682@_db_user:fYuMLJcGRCIVG54c@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 3. Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select project: `new-web-dusky`
3. Go to: **Settings** → **Environment Variables**
4. Add:

   **MONGODB_URI:**
   ```
   mongodb+srv://vs9953682@_db_user:fYuMLJcGRCIVG54c@YOUR_CLUSTER_URL.mongodb.net/?retryWrites=true&w=majority
   ```

   **MONGODB_DB:**
   ```
   tenx_registrations
   ```

5. Select: **Production, Preview, Development**
6. Click **Save**
7. **Redeploy** your project

### 4. Allow Network Access

In MongoDB Atlas:
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

## Done! ✅

Your backend will now:
- ✅ Save registrations to MongoDB
- ✅ Generate admit card PDFs
- ✅ Email PDFs to users
- ✅ Store PDFs in Vercel Blob

## Test It

1. Go to your registration form
2. Fill and submit
3. Check email for admit card
4. Check Vercel logs for any errors

