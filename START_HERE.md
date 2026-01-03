
# 🚨 IMPORTANT: Fix "Server Error" Issue

## The Problem
You're seeing "Server error" because **MongoDB is not running** on your computer.

## ✅ Quick Solution (Choose One)

### Option 1: MongoDB Atlas (Cloud - 5 minutes) ⭐ RECOMMENDED

**No installation needed!**

1. **Sign up for free MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a region (closest to you)
   - Click "Create"

3. **Set up database user:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `dayflow`
   - Password: Create and **SAVE** a password
   - Click "Add User"

4. **Allow network access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://dayflow:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/...`

6. **Update backend/.env:**
   - Open `backend/.env` file
   - Replace the `MONGODB_URI` line with your connection string:
     ```
     MONGODB_URI=mongodb+srv://dayflow:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dayflow?retryWrites=true&w=majority
     ```
   - Replace `YOUR_PASSWORD` with the password you created

7. **Test connection:**
   ```bash
   cd backend
   node test-connection.js
   ```
   Should show: ✅ MongoDB connected successfully!

8. **Restart backend server:**
   - Stop the current server (Ctrl+C)
   - Start again: `npm run dev`

9. **Try signing up again!** ✅

---

### Option 2: Install MongoDB Locally

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI, Latest version
   - Download and install

2. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - Or run: `mongod` in a terminal

3. **Test connection:**
   ```bash
   cd backend
   node test-connection.js
   ```

4. **Restart backend:**
   ```bash
   npm run dev
   ```

---

## ✅ After MongoDB is Connected

1. You should see in backend terminal: "MongoDB connected successfully"
2. Go to http://localhost:3000
3. Try signing up - it should work! ✅

---

## Still Having Issues?

1. Check backend terminal for error messages
2. Run: `cd backend && node test-connection.js`
3. Verify `.env` file has correct MONGODB_URI
4. Make sure backend server is running: `npm run dev`

---

**The application code is working correctly - you just need MongoDB running!** 🎯

