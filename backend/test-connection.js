// Quick test script to check MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dayflow';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', err.message);
    console.log('\n💡 Solutions:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. For Windows: Check if MongoDB service is running');
    console.log('3. Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env');
    process.exit(1);
  });

