# Environment Setup

Since the `.env` file cannot be auto-created, please create it manually:

1. Create a file named `.env` in the `backend` folder
2. Add the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow
JWT_SECRET=dayflow_secret_key_2024_secure_random_string
JWT_EXPIRE=7d
NODE_ENV=development
```

**Note:** 
- If you're using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Make sure MongoDB is running before starting the backend server

