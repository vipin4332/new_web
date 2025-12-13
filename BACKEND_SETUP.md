# Backend Setup Guide - Brevo Email OTP

This backend server sends OTP emails using Brevo (formerly Sendinblue) - a free email service that provides 300 emails per day.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Brevo account (free)

## Step 1: Create Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Sign up for a free account (300 emails/day free)
3. Verify your email address

## Step 2: Get Brevo API Key

1. Log in to your Brevo account
2. Go to **Settings** → **API Keys** (or visit: https://app.brevo.com/settings/keys/api)
3. Click **Generate a new API key**
4. Give it a name (e.g., "Tenx OTP Service")
5. Copy the API key (you'll only see it once!)

## Step 3: Verify Sender Email

1. In Brevo dashboard, go to **Settings** → **Senders** (or visit: https://app.brevo.com/settings/senders)
2. Click **Add a sender**
3. Enter your email address and name
4. Verify the email address (check your inbox for verification email)

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Brevo API key:
   ```
   BREVO_API_KEY=your_actual_api_key_here
   BREVO_SENDER_EMAIL=your_verified_email@example.com
   BREVO_SENDER_NAME=Tenx Registration
   PORT=5000
   NODE_ENV=development
   ```

## Step 6: Start the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 7: Test the Server

1. Check health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

2. Test OTP sending:
   ```bash
   curl -X POST http://localhost:5000/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

## API Endpoints

### GET /health
Health check endpoint
- **Response**: `{ status: 'ok', message: 'Server is running', brevoConfigured: true/false }`

### POST /send-otp
Send OTP to email address
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to your email"
  }
  ```

## Frontend Integration

The frontend (`registration-form.html`) is already configured to call this backend. Make sure:

1. Backend server is running on port 5000
2. Update `API_BASE_URL` in `registration-form.html` if using a different port or domain
3. For production, update the API URL to your deployed backend URL

## Deployment

### Deploy to Heroku:
```bash
heroku create your-app-name
heroku config:set BREVO_API_KEY=your_api_key
heroku config:set BREVO_SENDER_EMAIL=your_email@example.com
git push heroku main
```

### Deploy to Railway:
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Deploy to Render:
1. Create new Web Service
2. Connect your repository
3. Add environment variables
4. Deploy

## Troubleshooting

### OTP emails not sending:
1. Check if Brevo API key is correct
2. Verify sender email is verified in Brevo
3. Check server logs for error messages
4. Ensure you haven't exceeded free tier limit (300 emails/day)

### CORS errors:
- The server has CORS enabled for all origins
- For production, restrict CORS to your frontend domain

## Free Tier Limits

- **Brevo Free**: 300 emails per day
- Perfect for small to medium applications
- No credit card required

## Support

- Brevo Documentation: https://developers.brevo.com/
- Brevo Support: https://help.brevo.com/

