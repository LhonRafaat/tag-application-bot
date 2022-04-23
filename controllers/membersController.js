import { findAll, findOne } from "../services/memberService.js";

export const getMembers = async (req, res) => {
  const members = findAll();

  res.status(200).json(members);
};

export const getMember = async (req, res) => {
  const member = await findOne(req.params.discordId);
  if (!member) return res.status(404).json({ message: "Member not found" });

  res.status(200).json(member);
};
