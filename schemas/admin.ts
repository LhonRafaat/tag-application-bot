import mongoose from "mongoose";
import validator from "validator";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false, select: false },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "invalid email"],
  },
});

export const Admin = model("Admin", adminSchema);
