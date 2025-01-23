import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "drawapp",
  });
};

export { connectDb };
