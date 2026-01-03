# MongoDB Setup Guide

## ❌ Current Issue: MongoDB is not running

The error "ECONNREFUSED" means MongoDB is not accessible on your system.

## ✅ Solution Options

### Option 1: Install MongoDB Locally (Recommended for Development)

#### Windows:
1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI, Latest version
   - Download and run the installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)

3. **Verify Installation:**
   - MongoDB should start automatically as a Windows service
   - Check services: Press `Win + R`, type `services.msc`, look for "MongoDB"

4. **Test Connection:**
   ```bash
   cd backend
   node test-connection.js
   ```
   Should show: ✅ MongoDB connected successfully!

5. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

---

### Option 2: Use MongoDB Atlas (Cloud - Free & Easy) ⭐ RECOMMENDED

This is the easiest option - no installation needed!

1. **Create Free Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set Up Database Access:**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `dayflow` (or any name)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access:**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File:**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dayflow?retryWrites=true&w=majority
     ```
   - Replace `username` and `password` with your database user credentials
   - Replace the cluster URL with your actual cluster URL

7. **Test Connection:**
   ```bash
   cd backend
   node test-connection.js
   ```
   Should show: ✅ MongoDB connected successfully!

8. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

---

## ✅ After MongoDB is Running

1. **Restart Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: "MongoDB connected successfully"

2. **Test the Application:**
   - Go to: http://localhost:3000
   - Try signing up
   - Should work without errors!

---

## Quick Test

Run this to test your MongoDB connection:
```bash
cd backend
node test-connection.js
```

**Success:** ✅ MongoDB connected successfully!
**Failure:** Follow the setup steps above

---

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community Edition: https://www.mongodb.com/try/download/community
- Check `TROUBLESHOOTING.md` for more help

