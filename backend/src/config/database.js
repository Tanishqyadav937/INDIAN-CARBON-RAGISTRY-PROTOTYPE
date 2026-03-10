import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Using mock data instead. Database features will use in-memory storage.');
    // Don't exit - allow app to run with mock data
  }

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });
};

// Function to check if database is connected
export const getDatabaseStatus = () => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
