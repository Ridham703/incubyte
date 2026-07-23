const mongoose = require('mongoose');

const connectDB = async () => {
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

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected Successfully');
  } catch (error) {
    console.error('MongoDB Disconnect Failure:', error);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
