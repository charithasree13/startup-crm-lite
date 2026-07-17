import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Establish connection to MongoDB Atlas database.
 * Uses the MONGODB_URI environment variable.
 * Exits the process with code 1 if connection fails.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is successfully established
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('[DATABASE ERROR] MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DATABASE WARNING] Primary MongoDB connection failed: ${error.message}`);
    
    // Check if the primary URI is already the local fallback to prevent loops
    const localFallbackURI = 'mongodb://127.0.0.1:27017/startup-crm-lite';
    if (mongoURI === localFallbackURI) {
      console.error('[DATABASE FATAL] Local MongoDB connection also failed. Exiting.');
      process.exit(1);
    }

    console.log(`[DATABASE INFO] Attempting connection to local MongoDB fallback: ${localFallbackURI}`);
    try {
      const connLocal = await mongoose.connect(localFallbackURI);
      console.log(`[DATABASE SUCCESS] Local MongoDB fallback connected: ${connLocal.connection.host}`);
    } catch (fallbackError) {
      console.error(`[DATABASE FATAL] Fallback connection failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
