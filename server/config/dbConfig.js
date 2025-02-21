import mongoose from "mongoose";

const dbConnection = async () => {
  console.log("mongodb uri", process.env.MONGODB_URI)
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;