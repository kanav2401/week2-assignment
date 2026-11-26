
const mongoose = require("mongoose");

// Establish MongoDB database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from environment variables"
      );
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log("----------------------------------------");
    console.log("MongoDB Connected Successfully");
    console.log(`Host: ${connection.connection.host}`);
    console.log(`Database: ${connection.connection.name}`);
    console.log("----------------------------------------");

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.name);
    process.exit(1);
  }
};

// Monitor database connection events
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.name);
});

module.exports = connectDB;
