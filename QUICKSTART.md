# Quick Start Guide - Dayflow HRMS

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas account)

## Quick Setup (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with your MongoDB URI
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d" > .env
npm run dev
```

### 2. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **Sign Up** as an Admin:
   - Go to Sign Up page
   - Use Employee ID: `ADMIN001`
   - Choose role: `Admin`
   - Create your account

2. **Sign In** with your credentials

3. **Create Employee Accounts**:
   - As Admin, you can view all employees
   - Employees can sign up themselves or you can create accounts

4. **Test Features**:
   - Check in/out for attendance
   - Apply for leave
   - View payroll
   - Generate reports

## Default Test Accounts

You can create these accounts for testing:

**Admin:**
- Employee ID: ADMIN001
- Email: admin@dayflow.com
- Role: Admin

**Employee:**
- Employee ID: EMP001
- Email: emp@dayflow.com
- Role: Employee

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGODB_URI in .env file
- For MongoDB Atlas, use the connection string

### Port Already in Use
- Change PORT in backend/.env
- Update proxy in frontend/vite.config.js

### CORS Errors
- Ensure backend is running
- Check API proxy configuration in vite.config.js

## Next Steps

- Customize the UI colors in `tailwind.config.js`
- Add email notifications (configure in backend/.env)
- Set up production build
- Deploy to your preferred hosting

Happy coding! 🚀

