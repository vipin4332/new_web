# MongoDB Setup Guide

## Your Credentials
- **Username:** `vs9953682@_db_user`
- **Password:** `fYuMLJcGRCIVG54c`

## Step-by-Step Setup

### 1. Get Your MongoDB Connection String

1. Go to https://www.mongodb.com/cloud/atlas
2. Log in to your account
3. Click on your cluster
4. Click **"Connect"** button
5. Select **"Connect your application"**
6. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Replace Credentials in Connection String

Replace `<username>` and `<password>` with your credentials:
- Replace `<username>` with: `vs9953682@_db_user`
- Replace `<password>` with: `fYuMLJcGRCIVG54c`

**Final connection string should look like:**
```
mongodb+srv://vs9953682@_db_user:fYuMLJcGRCIVG54c@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 3. Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project (`new-web-dusky`)
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

   **Variable 1:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://vs9953682@_db_user:fYuMLJcGRCIVG54c@YOUR_CLUSTER_URL.mongodb.net/?retryWrites=true&w=majority`
   - Replace `YOUR_CLUSTER_URL` with your actual cluster URL from step 1

   **Variable 2:**
   - Name: `MONGODB_DB`
   - Value: `tenx_registrations`

4. **Important:** Select all environments (Production, Preview, Development)
5. Click **Save**

### 4. Network Access Setup

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
4. Click **Confirm**

### 5. Database User Setup

1. In MongoDB Atlas, go to **Database Access**
2. Make sure user `vs9953682@_db_user` exists
3. User should have **"Read and write to any database"** permissions

### 6. Redeploy on Vercel

1. After adding environment variables, go to **Deployments** tab
2. Click the three dots (⋯) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Testing

After deployment, test the registration form:
1. Fill out the form
2. Submit
3. Check Vercel function logs for any errors
4. Check your email for the admit card PDF

## Troubleshooting

### Connection Error
- Verify connection string is correct
- Check network access is set to allow all IPs
- Verify database user has correct permissions

### Authentication Error
- Double-check username and password in connection string
- Make sure special characters in password are URL-encoded if needed

### Timeout Error
- Check MongoDB Atlas cluster is running
- Verify network access settings

