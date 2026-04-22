import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  image: { type: String, default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },

  address: {
    line1: { type: String, default: "Not Provided" },
    line2: { type: String, default: "Not Provided" },
  },
  gender: {
    type: String,
    default: "Not Selected"
  },
  dob: {
    type: String,
    default: "Not Selected"
  },
  phone: {
    type: String,
    default: ""
  }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
