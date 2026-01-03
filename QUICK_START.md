# ⚡ Quick Start Guide

## 🚨 The Error You Saw

```
npm error enoent Could not read package.json
```

**This happens when you run `npm run dev` from the root directory!**

## ✅ Correct Way to Start

### Step 1: Start Backend Server

Open a terminal/PowerShell and run:
```powershell
cd "P:\Odoo hackathon\backend"
npm run dev
```

**Wait for:** "Server is running on port 5000"

### Step 2: Start Frontend Server

Open a **NEW** terminal/PowerShell window and run:
```powershell
cd "P:\Odoo hackathon\frontend"
npm run dev
```

**Wait for:** "Local: http://localhost:3000/"

---

## 🌐 Access the Application

Once both servers are running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

---

## ⚠️ Important Notes

1. **You need TWO terminal windows** - one for backend, one for frontend
2. **Always navigate to the folder first** (`backend` or `frontend`)
3. **Don't run commands from the root directory** (`P:\Odoo hackathon`)

---

## 🔍 Verify Servers Are Running

Check if ports are in use:
```powershell
netstat -ano | findstr ":5000 :3000"
```

You should see both ports listed.

---

## 📋 Directory Structure

```
P:\Odoo hackathon\
├── backend\          ← Run `npm run dev` HERE
│   └── package.json
├── frontend\         ← Run `npm run dev` HERE
│   └── package.json
└── README.md
```

**Never run `npm run dev` from the root!** Always go into `backend` or `frontend` first.

---

## 🛑 To Stop Servers

Press `Ctrl + C` in each terminal window.

---

**Need help? See `START_SERVERS.md` for more details!**

