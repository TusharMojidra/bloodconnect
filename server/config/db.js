import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('No MONGODB_URI provided, starting in-memory MongoDB...');
    try {
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log('In-memory MongoDB connected successfully at', memUri);
      return;
    } catch (error) {
      console.error('Failed to start in-memory MongoDB:', error.message);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
