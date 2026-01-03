# Dayflow - Human Resource Management System

**Every workday, perfectly aligned.**

A comprehensive HRMS built with React + Vite (Frontend) and Node.js + Express.js (Backend) to digitize and streamline core HR operations.

## Features

- 🔐 **Secure Authentication** - Sign Up / Sign In with JWT
- 👥 **Role-based Access** - Admin/HR vs Employee roles
- 📝 **Employee Profile Management** - View and edit employee profiles
- ⏰ **Attendance Tracking** - Daily/weekly views with check-in/check-out
- 🏖️ **Leave Management** - Apply for leave, approve/reject requests
- 💰 **Payroll Management** - View salary details and generate payroll
- 📊 **Analytics & Reports** - Dashboard with insights and reports
- 🎨 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Recharts (for analytics)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (password hashing)

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Account

1. Navigate to the Sign Up page
2. Fill in:
   - Employee ID
   - Email
   - Password (min 6 characters)
   - Role (Employee, HR Officer, or Admin)
3. Click "Sign Up"

### Signing In

1. Navigate to the Sign In page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your dashboard based on your role

### Employee Features

- **Dashboard**: View quick stats and check-in/check-out
- **Profile**: View and edit personal information
- **Attendance**: Track daily/weekly attendance
- **Leave**: Apply for leave and view status
- **Payroll**: View salary details

### Admin/HR Features

- **Dashboard**: View all employees and system overview
- **Profile**: View and edit any employee profile
- **Attendance**: View all employee attendance records
- **Leave**: Approve or reject leave requests
- **Payroll**: Generate and manage payroll for all employees
- **Analytics**: View reports and insights

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/:id` - Get employee profile (Admin only)
- `PUT /api/profile/:id` - Update employee profile (Admin only)

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my` - Get user attendance
- `GET /api/attendance` - Get all attendance (Admin only)

### Leave
- `POST /api/leave` - Apply for leave
- `GET /api/leave/my` - Get user leave requests
- `GET /api/leave` - Get all leave requests (Admin only)
- `PUT /api/leave/:id/approve` - Approve leave (Admin only)
- `PUT /api/leave/:id/reject` - Reject leave (Admin only)

### Payroll
- `GET /api/payroll/my` - Get user payroll
- `GET /api/payroll` - Get all payroll (Admin only)
- `POST /api/payroll/generate` - Generate payroll (Admin only)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/reports` - Get reports (Admin only)

## Default Roles

- **Employee**: Regular user with limited access
- **HR Officer**: Can manage employees and approve requests
- **Admin**: Full system access

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Protected API routes

## Future Enhancements

- Email notifications
- Document upload and management
- Advanced reporting
- Mobile app support
- Real-time notifications
- Calendar integration

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for efficient HR management**

