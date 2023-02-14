import { Members } from "../schemas/member.js";

export const findAll = async () => {
  const members = await Members.find();
  return members;
};

export const findOne = async (discordId) => {
  return await Members.findOne({ discordId });
};
export const findByGameId = async (gameId) => {
  const member = await Members.findOne({ originIds: gameId });
  return member;
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
  avatar,
  games
) => {
  const member = new Members({
    discordId,
    originIds,
    platforms,
    hasTag,
    fullName,
    userNames,
    avatar,
    games,
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
  let members = await Members.aggregate([
    {
      $unwind: {
        path: "$userNames",
      },
    },
    {
      $group: {
        _id: "$userNames",
        totalVotes: {
          $sum: { $add: ["$skills", "$personality", "$contribution"] },
        },
      },
    },
    {
      $sort: {
        totalVotes: -1,
      },
    },
  ]);
  let ranking = "";
  members = members.slice(0, 10);

  if (members.length > 0)
    members.map((el, i) => {
      ranking = ranking + `\n${i + 1}- ${el._id}`;
    });
  if (!ranking.length > 0) ranking = "No members found";

  return ranking;
};

export const registerBf2Account = async (discordId, bf2Name, fullName) => {
  const member = await Members.findOne({ discordId });

  if (member) {
    if (!member.userNames.includes(bf2Name)) {
      member.userNames.push(bf2Name);
      await member.save();
    }
    if (!member.bf2profile.includes({ name: bf2Name })) {
      member.bf2profile.push({ name: bf2Name });
      await member.save();
    }
  } else {
    const bf2profile = [
      {
        name: bf2Name,
      },
    ];
    const newMember = await Members.create({
      discordId,
      userNames: [bf2Name],
      fullName,
      avatar: "./assets/images/default-avatar.jpg",
      bf2profile,
    });

    return newMember;
  }
};

export const checkBf2Profiles = async (gameName) => {
  const members = await Members.find({
    bf2profile: {
      $exists: true,
    },
  }).select("bf2profile");

  // check if gameName exists in members
  const exists = members.some((member) => {
    return member.bf2profile.some((profile) => {
      return profile.name === gameName;
    });
  });
  return exists;
};
