import User from '../models/User.js';

// Get default user for operations (creates one if none exists)
export const getDefaultUser = async () => {
  let user = await User.findOne();
  
  if (!user) {
    user = await User.create({
      employeeId: 'DEMO001',
      email: 'demo@dayflow.com',
      password: 'demo123',
      role: 'employee',
      personalDetails: {
        firstName: 'Demo',
        lastName: 'User',
      },
    });
  }
  
  return user;
};

// Get user by ID or return default
export const getUserById = async (id) => {
  if (id) {
    const user = await User.findById(id);
    if (user) return user;
  }
  return await getDefaultUser();
};

