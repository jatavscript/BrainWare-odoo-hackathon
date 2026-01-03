# Dayflow Project

## Human Resource Management System (HRMS)

This project aims to build a modular **Human Resource Management System (HRMS)** that digitizes and streamlines all employee-related operations inside an organization, replacing manual registers, spreadsheets, emails, and scattered HR tools with a centralized, secure, real-time, and easy-to-use application.

---

## Traceability Table

| Feature / Endpoint / View                            | PDF Section / Description               |
| ---------------------------------------------------- | --------------------------------------- |
| **Authentication**                                   | Authentication Module                   |
| User signup                                          | Authentication Module – User signup     |
| User login                                           | Authentication Module – User login      |
| POST /auth/signup                                    | APIs Required – Auth                    |
| POST /auth/login                                     | APIs Required – Auth                    |
| **Password Security**                                | Authentication Module                   |
| Password hashing                                     | Authentication Module – Security        |
| Session-based authentication                         | Authentication Module                   |
| Role-based access (Admin / Employee)                 | Authentication Module                   |
| Redirect to Role Dashboard                           | Authentication Module                   |
| **HR Dashboard**                                     | HR Dashboard                            |
| Total Employees                                      | HR Dashboard – KPIs                     |
| Present / Absent Employees                           | HR Dashboard – KPIs                     |
| Pending Leave Requests                               | HR Dashboard – KPIs                     |
| Payroll Overview                                     | HR Dashboard – KPIs                     |
| Dashboard Filters                                    | Dashboard Filters                       |
| Filter by Department                                 | Dashboard Filters                       |
| Filter by Date                                       | Dashboard Filters                       |
| Filter by Leave Status                               | Dashboard Filters                       |
| Frontend Dashboard UI                                | Frontend Requirements – Dashboard       |
| **Employee Management**                              | Core Modules – 1) Employee Management   |
| Create employee profile                              | Employee Management                     |
| Update employee details                              | Employee Management                     |
| View employee list                                   | Employee Management                     |
| Employee personal details                            | Employee Management – Fields            |
| Department & designation                             | Employee Management – Fields            |
| Joining date                                         | Employee Management – Fields            |
| Salary structure                                     | Employee Management – Fields            |
| GET /employees                                       | APIs Required – Employees               |
| POST /employees                                      | APIs Required – Employees               |
| PUT /employees/:id                                   | APIs Required – Employees               |
| Frontend Employee CRUD pages                         | Frontend Requirements                   |
| **Attendance Management**                            | Core Modules – 2) Attendance Management |
| Daily check-in                                       | Attendance Management                   |
| Daily check-out                                      | Attendance Management                   |
| Attendance status (Present, Absent, Half-day, Leave) | Attendance Management                   |
| Weekly attendance view                               | Attendance Management                   |
| Monthly attendance view                              | Attendance Management                   |
| GET /attendance                                      | APIs Required – Attendance              |
| POST /attendance/check-in                            | APIs Required – Attendance              |
| POST /attendance/check-out                           | APIs Required – Attendance              |
| Frontend Attendance UI                               | Frontend Requirements                   |
| **Leave Management**                                 | Core Modules – 3) Leave Management      |
| Apply for leave                                      | Leave Management                        |
| Leave type selection                                 | Leave Management                        |
| Date range validation                                | Leave Management                        |
| Leave approval / rejection                           | Leave Management                        |
| Leave status tracking                                | Leave Management                        |
| POST /leave/apply                                    | APIs Required – Leave                   |
| PUT /leave/:id/approve                               | APIs Required – Leave                   |
| PUT /leave/:id/reject                                | APIs Required – Leave                   |
| Frontend Leave UI                                    | Frontend Requirements                   |
| **Payroll Management**                               | Core Modules – 4) Payroll Management    |
| Salary calculation                                   | Payroll Management                      |
| Attendance-based deductions                          | Payroll Management                      |
| Monthly payroll records                              | Payroll Management                      |
| Payslip view                                         | Payroll Management                      |
| GET /payroll                                         | APIs Required – Payroll                 |
| PUT /payroll/:id                                     | APIs Required – Payroll                 |
| Frontend Payroll UI                                  | Frontend Requirements                   |
| **Navigation**                                       | Navigation (Left Sidebar)               |
| Dashboard link                                       | Navigation                              |
| Employees link                                       | Navigation                              |
| Attendance link                                      | Navigation                              |
| Leave management link                                | Navigation                              |
| Payroll link                                         | Navigation                              |
| Profile & Logout                                     | Navigation                              |
| **Backend Requirements**                             | Backend Requirements                    |
| Session management                                   | Backend Requirements                    |
| Role-based access control                            | Backend Requirements                    |
| Prepared SQL statements                              | Backend Requirements                    |
| Data validation                                      | Backend Requirements                    |
| **Frontend Requirements**                            | Frontend Requirements                   |
| Clean UI                                             | Non-functional Requirements             |
| Responsive layout                                    | Non-functional Requirements             |
| Fast page loads                                      | Non-functional Requirements             |

---

## Quick Start

### Prerequisites

- XAMPP (Apache + MySQL)
- PHP 8+
- MySQL 8+
- Web browser (Chrome recommended)

---

### Running Locally (XAMPP Setup)

#### Backend & Database Setup

1. **Clone or copy the project folder**

into:


2. **Start XAMPP**
- Start **Apache**
- Start **MySQL**

3. **Create the database**
- Open http://localhost/phpmyadmin
- Create a database named:
  ```
  dayflow_hrms
  ```
- Import the file:
  ```
  database.sql
  ```

4. **Configure database connection**
Edit:

and ensure credentials match your local setup.

---

#### Running the Application

1. Open browser and go to:


2. Login using sample credentials (see below)

---

## Sample Login Credentials

After importing `database.sql`, use the following test accounts:

### Admin Account
- Email: `admin@dayflow.com`
- Password: `admin123`

### Employee Account
- Email: `employee@dayflow.com`
- Password: `employee123`

---

## First Steps

### Admin
1. Login as **Admin**
2. Add or manage employees
3. View attendance dashboard
4. Approve or reject leave requests
5. Manage payroll

### Employee
1. Login as **Employee**
2. View dashboard
3. Check-in / check-out attendance
4. Apply for leave
5. View salary details

---

## Notes

- All passwords are securely hashed
- Role-based access is enforced
- Employees can only view their own data
- Admin has full system access
- Designed for academic submission and demos

