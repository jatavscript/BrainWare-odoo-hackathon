# 🚀 Quick Fix for "Server Error"

## The Problem
MongoDB is not running on your system.

## ⚡ Fastest Solution (5 minutes)

### Use MongoDB Atlas (Cloud - No Installation Needed)

1. **Sign up for free MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create free account

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Click "Create"

3. **Create database user:**
   - Go to "Database Access"
   - Add user: username `dayflow`, create password
   - Save the password!

4. **Allow network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update backend/.env:**
   ```
   MONGODB_URI=paste_your_connection_string_here
   ```
   Replace `username` and `password` in the connection string with your database user credentials.

7. **Test:**
   ```bash
   cd backend
   node test-connection.js
   ```

8. **Restart backend:**
   ```bash
   npm run dev
   ```

9. **Try signing up again!** ✅

---

## Alternative: Install MongoDB Locally

See `MONGODB_SETUP.md` for detailed instructions.

---

**After MongoDB is connected, the "Server error" will be fixed!** 🎉

