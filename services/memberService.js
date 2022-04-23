import { Members } from "../schemas/member.js";

export const findAll = async () => {
  return await Members.find();
};

export const findOne = async (discordId) => {
  return await Members.findOne({ discordId });
};
