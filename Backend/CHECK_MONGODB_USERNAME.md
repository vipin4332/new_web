# How to Check Your MongoDB Atlas Username

## Step-by-Step Guide

### Method 1: Check in MongoDB Atlas Dashboard

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Log in to your account

2. **Navigate to Database Access:**
   - In the left sidebar, click **"Security"**
   - Click **"Database Access"** (or "Database Users")

3. **View Your Users:**
   - You'll see a list of all database users
   - Look for your user in the list
   - The username will be displayed in the **"Username"** column

4. **Check the Username:**
   - If you see: `vs9953682_db_user` → Use this in connection string as-is
   - If you see: `vs9953682@_db_user` → You need to URL-encode `@` as `%40` in connection string

### Method 2: Check from Connection String

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Click on your cluster

2. **Get Connection String:**
   - Click **"Connect"** button
   - Select **"Connect your application"**
   - You'll see a connection string like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/...
     ```
   - The `<username>` part shows what MongoDB expects

3. **Compare:**
   - If the template shows `<username>` and you created user as `vs9953682_db_user`, use that
   - If it shows something else, use that exact username

### Method 3: Test the Connection String

If you're not sure, you can test both versions:

**Version 1 (without @):**
```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

**Version 2 (with @, URL-encoded):**
```
mongodb+srv://vs9953682%40_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

**How to test:**
1. Add one version to Vercel environment variables
2. Deploy and check Vercel function logs
3. If you see connection errors, try the other version

## Quick Check: What You Currently Have

Looking at your connection string:
```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?appName=Cluster0
```

This suggests your username is: **`vs9953682_db_user`** (without @)

## If Username Has Special Characters

If your username contains special characters, you need to URL-encode them:

| Character | URL-Encoded |
|-----------|-------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |

**Example:**
- Username: `vs9953682@_db_user`
- In connection string: `vs9953682%40_db_user`

## Verify Your Username is Correct

After checking, update your connection string in Vercel:

**If username is `vs9953682_db_user` (no @):**
```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

**If username is `vs9953682@_db_user` (with @):**
```
mongodb+srv://vs9953682%40_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

## Still Not Sure?

1. Go to MongoDB Atlas → Database Access
2. Click on your user
3. You can see the exact username there
4. Copy it exactly as shown
5. If it has `@`, replace it with `%40` in the connection string

