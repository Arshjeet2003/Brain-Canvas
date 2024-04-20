import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(`Mongo DB connected ------ DB_HOST`);
  } catch (error) {
    console.log("Mongo DB connection ERROR : ", error);
    process.exit(1);
  }
};

export default connectDB;
