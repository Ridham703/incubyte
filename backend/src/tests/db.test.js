const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    readyState: 0,
  },
}));

describe('MongoDB Database Connection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should successfully connect to MongoDB Atlas with valid URI', async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
    mongoose.connect.mockResolvedValueOnce(mongoose);

    const result = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test_db');
    expect(result).toBe(true);
  });

  it('should handle database connection failure gracefully when mongoose.connect rejects', async () => {
    process.env.MONGO_URI = 'mongodb://invalid-uri:27017/test_db';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mongoose.connect.mockRejectedValueOnce(new Error('Connection failed'));

    const result = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'MongoDB Connection Failure:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it('should fail connection if MONGO_URI environment variable is missing', async () => {
    delete process.env.MONGO_URI;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await connectDB();

    expect(mongoose.connect).not.toHaveBeenCalled();
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'MongoDB Connection Error: MONGO_URI environment variable is not defined.'
    );
    consoleSpy.mockRestore();
  });

  it('should disconnect from MongoDB cleanly using disconnectDB', async () => {
    mongoose.disconnect.mockResolvedValueOnce(undefined);

    await disconnectDB();

    expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
  });
});
