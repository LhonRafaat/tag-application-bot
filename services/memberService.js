import { Members } from "../schemas/member.js";

export const findAll = async () => {
  const members = await Members.find();
  return members;
};

export const findOne = async (discordId) => {
  return await Members.findOne({ discordId });
};

export const findOneByName = async (name) => {
  // this is case sensitive which I have to fix.
  console.log(name);
  return await Members.findOne({ fullName: name });
};

export const createMember = async (
  discordId,
  originIds,
  platforms,
  hasTag,
  fullName,
  userNames
) => {
  const member = new Members({
    discordId,
    originIds,
    platforms,
    hasTag,
    fullName,
    userNames,
  });
  console.log("created");

  return await member.save();
};

export const deleteOne = async (id) => {
  const member = await Members.findById(id);
  if (!member) console.log("member not found");

  await Members.findByIdAndDelete(id);
};
