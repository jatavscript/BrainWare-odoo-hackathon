# 🚀 How to Start the Servers

## ⚠️ Important
You must run `npm run dev` from **inside** the `backend` or `frontend` folder, NOT from the root directory!

## ✅ Correct Way to Start Servers

### Option 1: Start Both Servers (Recommended)

**Open TWO separate terminal windows:**

#### Terminal 1 - Backend:
```powershell
cd "P:\Odoo hackathon\backend"
npm run dev
```

#### Terminal 2 - Frontend:
```powershell
cd "P:\Odoo hackathon\frontend"
npm run dev
```

---

### Option 2: Start One at a Time

**Start Backend First:**
```powershell
cd "P:\Odoo hackathon\backend"
npm run dev
```
Wait until you see: "Server is running on port 5000"

**Then Start Frontend (in a new terminal):**
```powershell
cd "P:\Odoo hackathon\frontend"
npm run dev
```

---

## ✅ What You Should See

### Backend Terminal:
```
Server is running on port 5000
MongoDB connected successfully  (if MongoDB is set up)
```

### Frontend Terminal:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## ❌ Common Error

**If you see:**
```
npm error enoent Could not read package.json
```

**This means:** You're in the wrong directory!

**Solution:** Make sure you're in `backend` or `frontend` folder, not the root folder.

---

## 🔍 Check Current Directory

To see where you are:
```powershell
pwd
# or
Get-Location
```

To navigate:
```powershell
cd "P:\Odoo hackathon\backend"    # For backend
cd "P:\Odoo hackathon\frontend"    # For frontend
```

---

## 📝 Quick Reference

| Server | Directory | Port | Command |
|--------|-----------|------|---------|
| Backend | `backend/` | 5000 | `npm run dev` |
| Frontend | `frontend/` | 3000 | `npm run dev` |

---

## 🛑 To Stop Servers

Press `Ctrl + C` in each terminal window.

---

**Remember: Always run commands from inside the `backend` or `frontend` folder!** 🎯

