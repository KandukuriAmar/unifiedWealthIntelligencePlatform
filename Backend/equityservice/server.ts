import dotenv from 'dotenv';
dotenv.config();

import app from './src/app';
import { connectDatabase } from './src/config/db';

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`equityservice is running on port ${port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown startup error';
    console.error(`Failed to start server: ${message}`);
    process.exit(1);
  }
};

void startServer();