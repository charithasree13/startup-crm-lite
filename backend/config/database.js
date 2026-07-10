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
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    // In modern Mongoose versions (8+ / 9+), useNewUrlParser and useUnifiedTopology
    // are enabled by default and setting them throws an error.
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failure: ${error.message}`);
    // Terminate server process on critical startup failure
    process.exit(1);
  }
};

export default connectDB;
