# Deploy Backend to Vercel

This guide will help you deploy the Tenx backend to Vercel.

## Prerequisites

- Vercel account (you already have one)
- GitHub repository connected to Vercel
- Brevo API key

## Step 1: Import Repository to Vercel

1. Go to your Vercel dashboard: https://vercel.com/new?teamSlug=vipin-sainis-projects-5d6aa81e
2. Click **"Import Git Repository"**
3. Select your repository: `vipin4332/new_web`
4. Click **"Import"**

## Step 2: Configure Project Settings

1. **Root Directory**: Set to `Backend`
   - In Vercel project settings, go to **Settings** → **General**
   - Under **Root Directory**, click **Edit**
   - Enter: `Backend`
   - Click **Save**

2. **Framework Preset**: Select **Other** (or leave as default)

3. **Build Command**: Leave empty (not needed for serverless functions)

4. **Output Directory**: Leave empty

## Step 3: Add Environment Variables

1. In Vercel project settings, go to **Settings** → **Environment Variables**

2. Add the following variables:

   ```
   BREVO_API_KEY = your_brevo_api_key_here
   ```
   (Use your Brevo API key - get it from https://app.brevo.com/settings/keys/api)

   ```
   BREVO_SENDER_EMAIL = your-verified-email@example.com
   ```
   (Replace with your verified Brevo sender email)

   ```
   BREVO_SENDER_NAME = Tenx Registration
   ```

   ```
   NODE_ENV = production
   ```

3. Make sure to add these for **Production**, **Preview**, and **Development** environments

4. Click **Save** for each variable

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for deployment to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

## Step 5: Update Frontend API URL

After deployment, update the frontend to use the Vercel backend URL:

1. Open `registration-form.html` in the root directory
2. Find this line:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000';
   ```
3. Replace with your Vercel URL:
   ```javascript
   const API_BASE_URL = 'https://your-project.vercel.app';
   ```

## API Endpoints

After deployment, your API endpoints will be:

- **Health Check**: `https://your-project.vercel.app/api/health`
- **Send OTP**: `https://your-project.vercel.app/api/send-otp`

## Testing

1. Test health endpoint:
   ```bash
   curl https://your-project.vercel.app/api/health
   ```

2. Test OTP sending:
   ```bash
   curl -X POST https://your-project.vercel.app/api/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

## Troubleshooting

### If deployment fails:
- Check that Root Directory is set to `Backend`
- Verify all environment variables are set
- Check Vercel deployment logs for errors

### If API returns 404:
- Make sure the `api` folder exists in the `Backend` directory
- Verify `vercel.json` is in the `Backend` directory
- Check that routes in `vercel.json` match the API file names

### If emails don't send:
- Verify BREVO_API_KEY is set correctly in Vercel
- Check that sender email is verified in Brevo
- Check Vercel function logs for error messages

## Important Notes

- The backend will be deployed as serverless functions
- Each API endpoint is a separate serverless function
- Environment variables are automatically injected
- CORS is enabled for all origins (you can restrict this in production)

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

