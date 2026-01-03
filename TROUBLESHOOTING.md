# Troubleshooting Server Errors

## Common Issues and Solutions

### 1. "Server error" on Sign Up/Sign In

**Most Common Cause: MongoDB not running**

**Solution:**
- **Option A: Install and Run MongoDB Locally**
  1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
  2. Install it
  3. Start MongoDB service:
     - Windows: MongoDB should start automatically as a service
     - Or run: `mongod` in a terminal

- **Option B: Use MongoDB Atlas (Cloud - Free)**
  1. Go to https://www.mongodb.com/cloud/atlas
  2. Create a free account
  3. Create a free cluster
  4. Get your connection string
  5. Update `backend/.env` file:
     ```
     MONGODB_URI=your_atlas_connection_string_here
     ```

### 2. Backend Server Not Running

**Check:**
- Open terminal in `backend` folder
- Run: `npm run dev`
- Should see: "Server is running on port 5000"
- Should see: "MongoDB connected successfully"

**If MongoDB connection fails:**
- Check if MongoDB is running
- Check your MONGODB_URI in `.env` file
- Restart the backend server

### 3. Frontend Can't Connect to Backend

**Check:**
- Backend is running on port 5000
- Frontend is running on port 3000
- Check browser console for CORS errors

### 4. Port Already in Use

**Solution:**
- Change PORT in `backend/.env` to a different port (e.g., 5001)
- Update `frontend/vite.config.js` proxy target to match

## Quick Fix Steps

1. **Ensure MongoDB is running:**
   ```bash
   # Check if MongoDB is running (Windows)
   Get-Service MongoDB
   ```

2. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Restart Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Check Backend Logs:**
   - Look for "MongoDB connected successfully"
   - If you see connection errors, MongoDB is not running

## Testing Connection

1. Open browser: http://localhost:5000/api/health
   - Should return: `{"status":"OK","message":"Dayflow API is running"}`

2. If this works but signup fails, it's a MongoDB issue.

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for error details
3. Verify `.env` file exists in backend folder
4. Verify MongoDB is accessible

