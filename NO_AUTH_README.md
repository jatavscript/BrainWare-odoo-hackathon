# Dayflow HRMS - No Authentication Version

## ✅ Authentication Removed

This version of the application has **authentication completely removed**. You can access all features directly without signing in or signing up.

## 🚀 Quick Start

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📝 Changes Made

### Backend:
- ✅ Removed all `protect` and `admin` middleware from routes
- ✅ All routes are now public
- ✅ Created `userHelper.js` to provide default user for operations
- ✅ Routes automatically use/create a demo user if needed

### Frontend:
- ✅ Removed `AuthProvider` and `AuthContext`
- ✅ Removed `SignIn` and `SignUp` pages
- ✅ Removed `PrivateRoute` component
- ✅ All pages are directly accessible
- ✅ Updated `Layout` component to work without auth

## 🌐 Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📋 Available Routes

All routes are accessible without authentication:

- `/dashboard` - Employee Dashboard
- `/admin/dashboard` - Admin Dashboard
- `/profile` - Profile Management
- `/attendance` - Attendance Tracking
- `/leave` - Leave Management
- `/payroll` - Payroll/Salary
- `/analytics` - Analytics & Reports

## ⚠️ Important Notes

1. **No User Management**: Since auth is removed, the system uses a default demo user
2. **MongoDB Still Required**: You still need MongoDB running for data storage
3. **All Features Work**: All HRMS features are fully functional without authentication

## 🔧 Default User

The system automatically creates/uses a demo user:
- Employee ID: `DEMO001`
- Email: `demo@dayflow.com`
- Role: `employee` (can be changed)

## 🎯 Next Steps

1. Set up MongoDB (see `MONGODB_SETUP.md`)
2. Start both servers
3. Access http://localhost:3000
4. Start using the HRMS features!

---

**All features work without authentication!** 🎉

