# 🚀 AYRUB Platform - Quick Start Guide

## ⚡ FASTEST WAY TO DEPLOY (5 Minutes)

### **Step 1: Deploy Frontend on Vercel**

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Enter: `https://github.com/architdev110/AL-IN-ONE-AYRUB-CREATION`
4. Select `frontend` folder
5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend.com/api
   REACT_APP_ENV=production
   ```
6. Click "Deploy" ✅

**Your Frontend URL:** `https://your-project-name.vercel.app`

---

### **Step 2: Deploy Backend on Railway**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Choose `backend` folder
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayrub
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRE=30d
   
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_PUBLISHABLE_KEY=your_public_key
   
   CORS_ORIGIN=https://your-frontend.vercel.app
   NODE_ENV=production
   PORT=5000
   ```
6. Click "Deploy" ✅

**Your Backend URL:** `https://your-backend-railway.up.railway.app`

---

### **Step 3: Setup MongoDB Atlas**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create a database user
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ayrub`
5. Add to your `.env` file

---

## 🏠 Local Development (Docker)

### **Requirements:**
- Docker & Docker Compose installed
- Node.js 18+

### **Run Everything:**

```bash
# Clone repo
git clone https://github.com/architdev110/AL-IN-ONE-AYRUB-CREATION.git
cd AL-IN-ONE-AYRUB-CREATION

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run with Docker
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## 🔐 Admin Access Setup

### **Create Super Admin Account:**

1. **First Time Setup:**
   ```bash
   # Backend terminal
   npm run seed
   ```

2. **Or Create Manually:**
   - Register at: http://localhost:3000/register
   - Email: `admin@ayrub.com`
   - Contact database admin to set role to `superadmin`

3. **Admin Panel Access:**
   - URL: http://localhost:3000/admin
   - Only accessible by admin/superadmin roles
   - Dashboard: View all users, payments, analytics
   - Users: Manage user accounts and statuses
   - Payments: View all transactions, verify QR payments
   - Settings: Configure system settings

---

## 💳 Payment Integration

### **Your QR Code Payment:**

1. Go to Admin Panel → Settings → Payment Settings
2. Upload your QR code image
3. Users scan and pay
4. You verify payment in Admin Panel
5. User gets subscription activated

### **Razorpay (India):**
- Key ID: Add to .env
- Key Secret: Add to .env
- Automatic webhook handling

### **Stripe (Global):**
- Secret Key: Add to .env
- Publishable Key: Add to .env
- Automatic webhook handling

---

## 📊 Features Available

✅ **Resume Builder** - Create professional resumes
✅ **ATS Analyzer** - Check resume score
✅ **Portfolio Builder** - Showcase projects
✅ **Interview Prep** - Mock interviews
✅ **Invoice Generator** - Create invoices
✅ **QR Code Generator** - Generate QR codes
✅ **PDF Tools** - Convert and manipulate PDFs
✅ **Notes Manager** - Organize notes
✅ **Expense Tracker** - Track expenses
✅ **GPA Calculator** - Calculate grades
✅ **URL Shortener** - Shorten URLs
✅ **Admin Panel** - Full control & analytics

---

## 🔑 Your Admin Credentials

**After Deployment, Create Your Account:**

```
Email: admin@ayrub.com (or your email)
Password: Your secure password
Role: superadmin
```

Then access: `https://your-frontend.vercel.app/admin`

---

## 📱 Mobile Responsive

✅ Fully responsive on all devices
✅ Mobile-first design
✅ Touch-optimized buttons
✅ Dark mode included

---

## 🆘 Troubleshooting

**Frontend not connecting to backend?**
- Check REACT_APP_API_URL in Vercel environment
- Verify backend URL is correct
- Check CORS settings in backend

**Payment not working?**
- Verify API keys in .env
- Check webhook URLs
- Test with test keys first

**Database connection fails?**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

---

## 📞 Support

- **GitHub Issues:** https://github.com/architdev110/AL-IN-ONE-AYRUB-CREATION/issues
- **Email:** support@ayrub.com

---

## 🎉 You're All Set!

Your AYRUB platform is now live and ready to use! 🚀

**Next Steps:**
1. ✅ Setup admin account
2. ✅ Configure payment providers
3. ✅ Upload your QR code
4. ✅ Invite users
5. ✅ Monitor analytics in admin panel

**Happy Building!** 💪
