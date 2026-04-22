import mongoose from "mongoose";

const connectDB = async () => {
  try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected to MONGO_DB')
  }
  catch(err){
    console.log('Database not connected:', err);
    
  }
}

export default connectDB
