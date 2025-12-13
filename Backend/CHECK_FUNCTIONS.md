# Check if Functions are Detected

## Step 1: Check Functions Tab in Vercel

1. Go to your Vercel project dashboard
2. Click on the **"Functions"** tab (or look for it in the sidebar)
3. You should see:
   - `api/health.js`
   - `api/send-otp.js`

**If you DON'T see these functions listed**, that's the problem!

## Step 2: Verify Root Directory

1. Go to **Settings** → **General**
2. Check **Root Directory**:
   - It should be: `Backend` (exactly, no trailing slash)
   - NOT: `Backend/`
   - NOT: `./Backend`
   - NOT: empty

## Step 3: Check File Structure in GitHub

Go to your GitHub repository and verify:
- `Backend/api/health.js` exists
- `Backend/api/send-otp.js` exists
- `Backend/package.json` exists

## Step 4: If Functions Still Not Detected

Try this alternative approach - create a simple index file to test:

1. The functions should be automatically detected
2. If not, we may need to adjust the structure

## Step 5: Check Deployment URL

After deployment, test:
- `https://new-web-dusky.vercel.app/api/health`
- `https://new-web-dusky.vercel.app/api/send-otp`

If you get 404, the functions aren't being detected.

