import { Admin } from "../schemas/admin.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

export const signup = async (userData) => {
  if (!userData.email || !userData.password)
    throw new Error("Username and password are required");

  if (userData.password !== userData.confirmPassword)
    throw new Error("Passwords do not match");
  const admin = await Admin.create({
    ...userData,
    password: await bcrypt.hash(userData.password, 10),
    confirmPassword: undefined,
  });
  jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  return admin;
};

export const login = async (userData) => {
  const admin = await Admin.findOne({ email: userData.email });
  if (!admin) {
    throw new Error("Invalid Credentials");
  }
  const isMatch = await bcrypt.compare(userData.password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  return { admin, token };
};
