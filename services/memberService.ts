import { Members } from "../schemas/member";

export const findAll = async () => {
  const members = await Members.find();
  return members;
};

export const findOne = async (discordId: string) => {
  return await Members.findOne({ discordId });
};
export const findByGameId = async (gameId: string) => {
  const member = await Members.findOne({ originIds: gameId });
  return member;
};
export const findOneByName = async (name: string) => {
  // this is case sensitive which I have to fix.
  return await Members.findOne({
    userNames: { $regex: name, $options: "i" },
  });
};

export const createMember = async (
  discordId: string,
  originIds: string,
  platforms: string,
  hasTag: boolean,
  fullName: string,
  userNames: string,
  avatar: string
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

export const deleteOne = async (id: string) => {
  const member = await Members.findById(id);
  if (!member) console.log("member not found");

  await Members.findByIdAndDelete(id);
};

export const updateUser = async (data: any) => {
  return await Members.findOneAndUpdate({ discordId: data.discordId }, data, {
    new: true,
    runValidators: true,
  });
};

export const updateTag = async (discordId: string, hasTag: boolean) => {
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
  if (ranking.length < 1) ranking = "No members found";

  return ranking;
};

export const registerBf2Account = async (
  discordId: string,
  bf2Name: string,
  fullName: string
) => {
  const member = await Members.findOne({ discordId });

  if (member) {
    if (!member.userNames.includes(bf2Name)) {
      member.userNames.push(bf2Name);
      await member.save();
    }
    if (!member.bf2profile.name) {
      member.bf2profile.name = bf2Name;
      await member.save();
      return member;
    }
  } else {
    const bf2profile = {
      name: bf2Name,
    };
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

export const checkBf2Profiles = async (gameName: string) => {
  const members = await Members.find({
    bf2profile: {
      $exists: true,
    },
  });

  // check if gameName exists in members
  const member = members.find((el) => el.bf2profile.name === gameName);
  if (member) return true;
  return false;
};
