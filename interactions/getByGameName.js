import { findByGameId } from "../services/memberService.js";
import { getPlate } from "../UI/userPlate.js";
import { isMod } from "../utils/isMod.js";
import { getUserProfile } from "../utils/utils.js";

export const getByGameName = async (interaction, settings) => {
  if (interaction.commandName === "getbygamename") {
    // check user if is head admin or founder

    const isAuthorized = await isMod(interaction, settings);
    if (!isAuthorized) {
      return await interaction.editReply({
        content: "You are not authorized to use this command",
        ephemeral: true,
      });
    }

    const username = await interaction.options.getString("username");
    const game = await interaction.options.getString("game");
    const platform = await interaction.options.getString("platform");
    try {
      const gameprofileData = await getUserProfile(game, username, platform);
      if (!gameprofileData?.data) {
        return await interaction.editReply({
          content: "User not found",
          ephemeral: true,
        });
      }
      const member = await findByGameId(gameprofileData.data.id);
      if (!member) {
        return await interaction.editReply({
          content: "User not in idf database",
          ephemeral: true,
        });
      }
      const attachment = await getPlate(
        gameprofileData.data.userName,
        member.discordId,
        gameprofileData.data.avatar,
        member.userNames[1] ? member.userNames[1] : undefined
      );
      //TODO: send a error message when user doesnt exist

      // big problem here, if ephemeral is true, we cannot react to the messag

      if (isAuthorized) {
        return await interaction.editReply({
          content: `<@${member.discordId}>`,
          ephemeral: true,
          files: [attachment],
        });
      } else {
        return await interaction.editReply({
          content: "Searched user is a member of our discord server",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      return await interaction.editReply({
        content: "Could not fetch queried user",
        ephemeral: true,
      });
    }
  }
};
