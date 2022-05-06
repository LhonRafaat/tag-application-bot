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
  return await Members.findOne({ userNames: name });
};

export const createMember = async (
  discordId,
  originIds,
  platforms,
  hasTag,
  fullName,
  userNames,
  avatar
) => {
  const member = new Members({
    discordId,
    originIds,
    platforms,
    hasTag,
    fullName,
    userNames,
    avatar,
  });
  console.log("created");

  return await member.save();
};

export const deleteOne = async (id) => {
  const member = await Members.findById(id);
  if (!member) console.log("member not found");

  await Members.findByIdAndDelete(id);
};

export const updateUser = async (discordId, originId, userName, platform) => {
  return await Members.findOneAndUpdate(
    discordId,
    {
      $push: { userNames: userName, platforms: platform, originIds: originId },
    },
    { new: true, runValidators: true }
  );
};

export const updateTag = async (discordId, hasTag) => {
  return await Members.findOneAndUpdate(
    { discordId },
    { hasTag },
    { new: true, runValidators: true }
  );
};
