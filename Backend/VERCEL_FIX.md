# Fixing 404 Error on Vercel

If you're getting a 404 error, follow these steps:

## Solution 1: Verify Root Directory

1. Go to your Vercel project settings
2. **Settings** → **General** → **Root Directory**
3. Make sure it's set to: `Backend` (not `Backend/` or anything else)
4. Click **Save**

## Solution 2: Redeploy

After changing settings, you need to redeploy:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

## Solution 3: Check API Endpoints

After deployment, your endpoints should be:

- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/send-otp`

**Note**: The `/api/` prefix is automatically added by Vercel for files in the `api` folder.

## Solution 4: Verify File Structure

Make sure your project structure looks like this:

```
Backend/
├── api/
│   ├── health.js
│   └── send-otp.js
├── package.json
└── (other files)
```

## Solution 5: Check Deployment Logs

1. Go to **Deployments** tab
2. Click on your deployment
3. Check the **Build Logs** for any errors
4. Check the **Function Logs** when you call the API

## Solution 6: Test Locally First

You can test the functions locally using Vercel CLI:

```bash
npm install -g vercel
cd Backend
vercel dev
```

This will start a local server that mimics Vercel's environment.

## Common Issues

### Issue: "Cannot find module"
- Make sure `package.json` is in the `Backend` folder
- Make sure all dependencies are listed in `package.json`

### Issue: "Function not found"
- Make sure files are in `Backend/api/` folder
- Make sure file names match: `health.js` and `send-otp.js`
- Make sure files export a function: `module.exports = async (req, res) => {...}`

### Issue: Environment variables not working
- Go to **Settings** → **Environment Variables**
- Make sure variables are added for **Production** environment
- Redeploy after adding variables

