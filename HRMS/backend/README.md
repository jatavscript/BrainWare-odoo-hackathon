# HRMS Backend

## Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:

```bash
npm install
```

3. Seed database (optional):

```bash
npm run seed
```

4. Start dev server:

```bash
npm run dev
```

### Default Accounts
- Admin: admin@hrms.com / Admin@123
- HR: hr@hrms.com / Hr@12345
- Employee: jane@hrms.com / Password@123

## API Endpoints
- GET `/api/health`
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (Bearer token)
- PATCH `/api/auth/approve/:id` (admin/hr)
- Employees (admin/hr):
  - GET `/api/employees`
  - GET `/api/employees/:id`
  - POST `/api/employees`
  - PUT `/api/employees/:id`
  - DELETE `/api/employees/:id`
