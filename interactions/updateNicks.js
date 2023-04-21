import { findAll, findOne } from "../services/memberService.js";
import { isMod } from "../utils/isMod.js";
import { games, getUserByGameId } from "../utils/utils.js";

export const updateNicks = async (interaction, settings) => {
  await isMod(interaction,settings);
  const members = await findAll();
  let usersUpdated = "";

  try {
    for await (const el of members) {
      const member = await findOne(el.discordId);
      for await (const game of games) {
        const user = await getUserByGameId(
          member.originIds[0],
          game,
          member.platforms[0]
        );
        if (user) {
          if (!member.userNames.includes(user?.data?.userName)) {
            member.userNames.unshift(user?.data?.userName);
            await member.save();

            // usersUpdated.push({
            //   name: member.fullName,
            //   newNick: user?.data?.userName,
            // });
            usersUpdated += `name : ${member.fullName}, newNick : ${user?.data?.userName} \n`;
          }
          break;
        }
      }
    }
    await interaction.editReply(
      usersUpdated.length > 0
        ? usersUpdated + "\n Were updated"
        : "Nicknames are up to date"
    );
  } catch (error) {
    await interaction.editReply(error.toString());
  }
};
