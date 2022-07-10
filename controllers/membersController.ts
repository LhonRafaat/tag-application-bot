import { Request, Response } from "express";
import {
  deleteOne,
  findAll,
  findOne,
  updateUser,
} from "../services/memberService";

export const getMembers = async (req: Request, res: Response) => {
  const members = await findAll();

  res.status(200).json(members);
};

export const getMember = async (req: Request, res: Response) => {
  const member = await findOne(req.params.discordId);
  if (!member) return res.status(404).json({ message: "Member not found" });

  res.status(200).json(member);
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    await deleteOne(req.params.id);
    return res.status(200).json({ message: "Member deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting member" });
  }
};

export const patchUser = async (req: Request, res: Response) => {
  try {
    const user = await updateUser(req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
