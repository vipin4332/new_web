# Vercel Environment Variables Check

## ✅ What You Have Correct:

1. **MONGODB_URI** is set ✓
2. Connection string format is mostly correct ✓
3. Cluster URL is correct: `cluster0.bjle6my.mongodb.net` ✓

## ⚠️ Issues Found:

### Issue 1: Connection String Parameters
**Current:**
```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?appName=Cluster0
```

**Should be (for better reliability):**
```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

**Note:** `appName=Cluster0` is optional. The recommended parameters are `retryWrites=true&w=majority` for better connection reliability.

### Issue 2: Missing MONGODB_DB Variable
You need to add a second environment variable:

**Key:** `MONGODB_DB`  
**Value:** `tenx_registrations`

### Issue 3: Username Check
If your MongoDB Atlas username is `vs9953682@_db_user` (with @ symbol), you need to URL-encode it in the connection string:
- `@` becomes `%40`
- So it would be: `vs9953682%40_db_user`

But if your actual username in MongoDB Atlas is `vs9953682_db_user` (without @), then your current connection string is correct.

## ✅ Action Items:

1. **Update MONGODB_URI** (optional but recommended):
   - Change from: `?appName=Cluster0`
   - Change to: `?retryWrites=true&w=majority`

2. **Add MONGODB_DB variable:**
   - Key: `MONGODB_DB`
   - Value: `tenx_registrations`

3. **Set for all environments:**
   - Make sure both variables are set for:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Verify MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Make sure "Allow Access from Anywhere" (0.0.0.0/0) is enabled

5. **Redeploy:**
   - After making changes, redeploy your Vercel project

## 📝 Corrected Connection String:

```
mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
```

## ✅ Complete Environment Variables List:

1. **MONGODB_URI:**
   ```
   mongodb+srv://vs9953682_db_user:fYuMLJcGRCIVG54c@cluster0.bjle6my.mongodb.net/?retryWrites=true&w=majority
   ```

2. **MONGODB_DB:**
   ```
   tenx_registrations
   ```

3. **BREVO_API_KEY:** (should already be set)
   ```
   [Your Brevo API Key]
   ```

4. **BREVO_SENDER_EMAIL:** (should already be set)
   ```
   vs9953682@gmail.com
   ```

5. **BREVO_SENDER_NAME:** (optional)
   ```
   Tenx Registration
   ```

