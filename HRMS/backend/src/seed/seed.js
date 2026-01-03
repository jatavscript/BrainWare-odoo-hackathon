import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Employee } from '../models/Employee.js';

async function run() {
  await connectDB(env.mongoUri);
  console.log('Connected to DB');

  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Employee.deleteMany({}),
  ]);

  const [admin, hr] = await Promise.all([
    User.create({ name: 'Admin User', email: 'admin@hrms.com', password: 'Admin@123', role: 'admin', isApproved: true }),
    User.create({ name: 'HR Manager', email: 'hr@hrms.com', password: 'Hr@12345', role: 'hr', isApproved: true }),
  ]);

  const departments = await Department.insertMany([
    { name: 'Engineering', description: 'Builds products' },
    { name: 'HR', description: 'People operations' },
    { name: 'Finance', description: 'Money matters' },
    { name: 'Sales', description: 'Revenue' },
  ]);

  const eng = departments.find(d => d.name === 'Engineering');

  const empUser = await User.create({ name: 'Jane Doe', email: 'jane@hrms.com', password: 'Password@123', role: 'employee', isApproved: true });
  await Employee.create({ user: empUser._id, employeeId: 'EMP-1001', department: eng._id, designation: 'Frontend Engineer', status: 'Active' });

  console.log('Seeded users:', { admin: admin.email, hr: hr.email });
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
