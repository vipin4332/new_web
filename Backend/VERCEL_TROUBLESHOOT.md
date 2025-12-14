# Vercel Deployment Troubleshooting

## If API endpoints still return 404:

### Step 1: Verify Root Directory
1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. Check **Root Directory** - it should be exactly: `Backend`
3. If it's different, change it to `Backend` and **Save**
4. **Redeploy** after changing

### Step 2: Check File Structure
Make sure your GitHub repository has this structure:
```
Backend/
├── api/
│   ├── health.js
│   └── send-otp.js
├── package.json
└── vercel.json
```

### Step 3: Check Deployment Logs
1. Go to **Deployments** tab
2. Click on your latest deployment
3. Check **Build Logs** for errors
4. Check **Function Logs** when you call the API

### Step 4: Verify Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Make sure these are set for **Production**:
   - `BREVO_API_KEY`
   - `BREVO_SENDER_EMAIL`
   - `BREVO_SENDER_NAME`
   - `NODE_ENV`

### Step 5: Test the Correct URLs
After deployment, test these URLs:
- `https://new-web-dusky.vercel.app/api/health`
- `https://new-web-dusky.vercel.app/api/send-otp`

**Note**: The `/api/` prefix is required!

### Step 6: Alternative - Use Express Server
If serverless functions don't work, we can deploy the Express server instead.
Let me know if you want to try this approach.

### Common Issues:

**Issue**: "Function not found"
- **Solution**: Make sure Root Directory is set to `Backend` (not `Backend/`)

**Issue**: "Cannot find module"
- **Solution**: Check that `package.json` is in the `Backend` folder with all dependencies

**Issue**: "404 on /api/health"
- **Solution**: Make sure you're using `/api/health` not `/health`

**Issue**: Environment variables not working
- **Solution**: Add variables for Production, Preview, AND Development environments

