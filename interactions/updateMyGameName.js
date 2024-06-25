import { findOne } from "../services/memberService.js";
import { games, getUserByGameId } from "../utils/utils.js";

export const updateMyGameName = async (interaction) => {
  try {
    const member = await findOne(interaction.member.id);
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
        }
        break;
      }
    }
    await interaction.editReply(
      "Fetched latest game name from game API successfully."
    );
  } catch (error) {
    await interaction.editReply(error.toString());
  }
};
