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
  return await Members.findOne({
    userNames: { $regex: name, $options: "i" },
  });
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

  return await member.save();
};

export const deleteOne = async (id) => {
  const member = await Members.findById(id);
  if (!member) console.log("member not found");

  await Members.findByIdAndDelete(id);
};

export const updateUser = async (data) => {
  return await Members.findOneAndUpdate({ discordId: data.discordId }, data, {
    new: true,
    runValidators: true,
  });
};

export const updateTag = async (discordId, hasTag) => {
  return await Members.findOneAndUpdate(
    { discordId },
    { hasTag },
    { new: true, runValidators: true }
  );
};

export const getMembersRanking = async () => {
  let members = await Members.find().sort({
    skills: -1,
    contribution: -1,
    personality: -1,
  });

  members = members
    .map((el, i) => {
      return `${i + 1}- ${el.userNames[0]}`;
    })
    .slice(0, 10);

  return members;
};
