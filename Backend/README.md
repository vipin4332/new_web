# Tenx Backend Server

Backend server for Tenx registration form with Brevo email OTP functionality.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env` (if exists)
   - Or create `.env` file with:
     ```
     BREVO_API_KEY=your_brevo_api_key
     BREVO_SENDER_EMAIL=your_verified_email@example.com
     BREVO_SENDER_NAME=Tenx Registration
     PORT=5000
     NODE_ENV=development
     ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /send-otp` - Send OTP to email address

## Documentation

- See `BACKEND_SETUP.md` for detailed setup instructions
- See `SETUP_COMPLETE.md` for configuration status

## Notes

- Make sure to verify your sender email in Brevo before sending emails
- The server runs on port 5000 by default
- Frontend should point to `http://localhost:5000` (or your deployed backend URL)

