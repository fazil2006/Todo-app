const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    // Try to connect with a 5-second timeout so it fails quickly if offline
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB connection failed: ${error.message}`);
    console.log("ℹ️ Starting server in In-Memory Fallback mode. Tasks will not persist on restart.");
  }
};

module.exports = connectDB;
