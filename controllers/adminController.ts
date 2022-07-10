import { Request, Response } from "express";
import { login, signup } from "../services/adminService";

export const signupCont = async (req: Request, res: Response) => {
  try {
    const admin = await signup(req.body);
    res.status(200).json(admin);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const loginCont = async (req: Request, res: Response) => {
  try {
    const admin = await login(req.body);
    res.status(200).json(admin);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
