import { Members } from "../schemas/member.js";

export const findAll = async () => {
  const members = await Members.find();
  return members;
};

export const findOne = async (discordId) => {
  return await Members.findOne({ discordId });
};

export const createMember = async (
  discordId,
  originId,
  platforms,
  hasTag,
  fullName
) => {
  const member = new Members({
    discordId,
    originId,
    platforms,
    hasTag,
    fullName,
  });
  console.log("created");

  return await member.save();
};

export const deleteOne = async (id) => {
  const member = await Members.findById(id);
  if (!member) console.log("member not found");

  await Members.findByIdAndDelete(id);
};
