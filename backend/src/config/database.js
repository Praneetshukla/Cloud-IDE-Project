const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas with retry logic.
 * Uses Mongoose's built-in connection pooling and event system.
 */
const connectDatabase = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
      });

      return conn;
    } catch (error) {
      console.error(
        `❌ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (attempt === MAX_RETRIES) {
        console.error('❌ All MongoDB connection attempts exhausted. Exiting.');
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

module.exports = connectDatabase;
