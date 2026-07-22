import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MongoDB Connection Error: MONGO_URI environment variable is not defined.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas Connected Successfully');
    return true;
  } catch (error) {
    console.error('MongoDB Connection Failure:', error);
    return false;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected Successfully');
  } catch (error) {
    console.error('MongoDB Disconnect Failure:', error);
  }
};
