# Tenx Registration Form - Complete Project Documentation

## 📋 Project Overview

This is a complete registration form system with email OTP verification. The project consists of a frontend (deployed on GitHub Pages) and a backend API (deployed on Vercel) that handles OTP generation and email sending via Brevo (formerly Sendinblue).

**Live URLs:**
- **Frontend:** https://vipin4332.github.io/new_web/
- **Backend API:** https://new-web-dusky.vercel.app

---

## ✨ Features

### Frontend Features
- ✅ Modern, responsive registration form
- ✅ Email OTP verification before form submission
- ✅ Form data persistence using localStorage (data saved when user navigates away)
- ✅ Back button to return to main website
- ✅ Real-time OTP timer (5-minute expiry)
- ✅ OTP resend functionality
- ✅ File upload support (Marksheet 10/12th)
- ✅ Form validation
- ✅ Auto-save form data

### Backend Features
- ✅ RESTful API endpoints
- ✅ Email OTP generation and sending via Brevo
- ✅ CORS enabled for frontend integration
- ✅ Serverless functions on Vercel
- ✅ Environment variable configuration
- ✅ Error handling and logging

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Functionality
- **localStorage API** - Data persistence
- **Fetch API** - Backend communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework (for local development)
- **Vercel Serverless Functions** - Production deployment
- **Axios** - HTTP client for Brevo API
- **Brevo (Sendinblue)** - Email service provider

### Deployment
- **GitHub Pages** - Frontend hosting
- **Vercel** - Backend serverless functions
- **Git** - Version control

---

## 📁 Project Structure

```
frontend/
├── index.html                      # Main landing page
├── registration-form.html          # Registration form with OTP verification
├── README.md                       # This file
├── DEPLOYMENT_CHECKLIST.txt        # Deployment checklist
├── .gitignore                      # Git ignore rules
│
└── Backend/                        # Backend API
    ├── api/                        # Vercel serverless functions
    │   ├── health.js              # Health check endpoint
    │   ├── send-otp.js            # OTP generation and email sending
    │   ├── submit.js              # Form submission handler
    │   └── test.js                # Test endpoint
    ├── server.js                   # Local Express server (for development)
    ├── package.json                # Node.js dependencies
    └── .gitignore                  # Backend git ignore rules
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- GitHub account
- Vercel account
- Brevo account (free tier available)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/vipin4332/new_web.git
cd new_web
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

#### 3. Environment Variables
Create a `.env` file in the `Backend` directory:
```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=Tenx Registration
PORT=5000
```

#### 4. Run Backend Locally
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

#### 5. Update Frontend API URL
In `registration-form.html`, update the API base URL for local development:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

#### 6. Open Frontend
Simply open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

---

## 🌐 Deployment

### Frontend Deployment (GitHub Pages)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select source branch: `main`
   - Select folder: `/ (root)`
   - Save

3. **Access your site:**
   - URL: `https://vipin4332.github.io/new_web/`

### Backend Deployment (Vercel)

#### Method 1: Vercel CLI
```bash
cd Backend
npm install -g vercel
vercel login
vercel
```

#### Method 2: Vercel Dashboard

1. **Connect Repository:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project Settings:**
   - **Root Directory:** `Backend`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   Go to Settings → Environment Variables and add:
   ```
   BREVO_API_KEY = your_brevo_api_key_here
   BREVO_SENDER_EMAIL = your_verified_email@example.com
   BREVO_SENDER_NAME = Tenx Registration
   ```
   ⚠️ **Note:** Replace with your actual Brevo API key and verified email address.
   ⚠️ **Important:** Set for all environments (Production, Preview, Development)

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API will be available at: `https://your-project.vercel.app`

---

## 🔌 API Endpoints

### Base URL
- **Production:** `https://new-web-dusky.vercel.app`
- **Local:** `http://localhost:5000`

### Endpoints

#### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "brevoConfigured": true
}
```

#### 2. Send OTP
```
POST /api/send-otp
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "otp": "123456"
}
```

#### 3. Submit Form
```
POST /api/submit
Content-Type: multipart/form-data

Body: FormData with all form fields
```
**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BREVO_API_KEY` | Brevo API key for email service | `xkeysib-...` |
| `BREVO_SENDER_EMAIL` | Verified sender email address | `vs9953682@gmail.com` |
| `BREVO_SENDER_NAME` | Display name for emails | `Tenx Registration` |

### How to Get Brevo API Key

1. Sign up at https://www.brevo.com (free tier available)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy the key and add it to your environment variables

### Verify Sender Email in Brevo

1. Go to Brevo Dashboard → Senders
2. Add your email address
3. Verify the email (check your inbox for verification link)
4. Once verified, you can use it as `BREVO_SENDER_EMAIL`

---

## 📝 Form Fields

### Personal Information
- First Name *
- Last Name *
- Date of Birth *
- Gender *
- Email * (with OTP verification)
- Phone Number *
- Address *
- City *
- State *
- Pincode *

### Educational Information
- Marksheet (10/12th) * (File upload)

### Additional Fields
- Any other fields as per requirements

---

## 🔄 OTP Verification Flow

1. User enters email address
2. User clicks "Send OTP" button
3. Frontend sends request to `/api/send-otp`
4. Backend generates 6-digit OTP
5. Backend sends OTP via email using Brevo
6. Backend returns OTP in response (for frontend verification)
7. Frontend stores OTP in sessionStorage
8. User enters OTP from email
9. Frontend verifies OTP against stored value
10. If valid, form submission is enabled
11. OTP expires after 5 minutes

---

## 🐛 Troubleshooting

### OTP Not Received
- ✅ Check spam folder
- ✅ Verify `BREVO_SENDER_EMAIL` is set correctly in Vercel
- ✅ Verify sender email is verified in Brevo dashboard
- ✅ Check Vercel function logs for errors

### "Invalid OTP" Error
- ✅ Ensure backend is returning OTP in response
- ✅ Check browser console for errors
- ✅ Verify OTP hasn't expired (5 minutes)
- ✅ Try requesting a new OTP

### 404 Errors
- ✅ Verify Vercel root directory is set to `Backend`
- ✅ Check API endpoint URLs include `/api/` prefix
- ✅ Ensure Vercel functions are deployed correctly

### CORS Errors
- ✅ Verify CORS headers are set in API functions
- ✅ Check API base URL in frontend matches backend URL

### Environment Variables Not Working
- ✅ Verify variables are set in Vercel dashboard
- ✅ Set for all environments (Production, Preview, Development)
- ✅ Redeploy after adding/updating variables

---

## 📊 Project Status

- ✅ Frontend deployed on GitHub Pages
- ✅ Backend deployed on Vercel
- ✅ OTP email sending working
- ✅ Form submission working
- ✅ Data persistence implemented
- ✅ Error handling implemented

---

## 🔒 Security Notes

1. **API Keys:** Never commit API keys to Git. Use environment variables.
2. **OTP Storage:** OTPs are stored in sessionStorage (client-side) for verification.
3. **Email Verification:** Sender email must be verified in Brevo.
4. **CORS:** Currently set to allow all origins (`*`). Consider restricting in production.

---

## 📞 Support & Contact

**Project Owner:** Vipin Saini  
**GitHub:** https://github.com/vipin4332  
**Repository:** https://github.com/vipin4332/new_web

---

## 📅 Changelog

### Version 1.0.0 (Current)
- ✅ Initial project setup
- ✅ Email OTP verification implemented
- ✅ Form data persistence
- ✅ Backend API deployment
- ✅ Frontend deployment
- ✅ Removed Confirm Email field
- ✅ Fixed OTP verification issue

---

## 🎯 Future Enhancements

- [ ] Backend OTP verification (more secure)
- [ ] Database integration for form submissions
- [ ] Email notifications to admin
- [ ] Form analytics
- [ ] Multi-step form wizard
- [ ] Image upload optimization
- [ ] Rate limiting for OTP requests
- [ ] SMS OTP option

---

## 📄 License

This is a personal project. All rights reserved.

---

## 🙏 Acknowledgments

- Brevo (Sendinblue) for email service
- Vercel for serverless hosting
- GitHub for frontend hosting

---

**Last Updated:** December 2024  
**Maintained By:** Vipin Saini

