import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection not ready");
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection error handler
    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB Connection Error:", err);
    });

    // Add disconnection handler
    mongoose.connection.on("disconnected", () => {
      console.log(" MongoDB Disconnected - Attempting to reconnect...");
    });

    return conn;
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    console.error("Connection details:", {
      uri: process.env.MONGO_URI,
      error: error.message,
      code: error.code,
      name: error.name,
    });
    process.exit(1);
  }
};

export default connectDB;
