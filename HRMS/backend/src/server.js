import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function start() {
  try {
    await connectDB(env.mongoUri);
    app.listen(env.port, () => {
      console.log(`HRMS backend running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
