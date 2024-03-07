import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp : {type : String},
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
});

const User = mongoose.model("User",userSchema);
export default User;