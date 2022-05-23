import { login, signup } from "../services/adminService.js";

export const signupCont = async (req, res) => {
  try {
    const admin = await signup(req.body);
    res.status(200).json(admin);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const loginCont = async (req, res) => {
  try {
    const admin = await login(req.body);
    res.status(200).json(admin);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
