import { findOne } from "../services/memberService.js";
import { getPlate } from "../UI/userPlate.js";
import { isMod } from "../utils/isMod.js";

export const getStatus = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  const mentionedUser = await interaction.options.getUser("username");

  const discordUser = await findOne(mentionedUser.id);

  if (!discordUser) {
    return await interaction.editReply({
      content: "User not found",
      ephemeral: true,
    });
  }

  //TODO : how can I get the user avatar from discord?

  // I could have just passed the whole user object here instead of passing discord id and fetching it again
  // in the plate, but idk why I did that ...
  const attachment = await getPlate(
    discordUser.userNames[0],
    discordUser.discordId,
    discordUser.avatar,
    discordUser.userNames[1] ? discordUser.userNames[1] : undefined
  );
  //TODO: send a error message when user doesnt exist

  // big problem here, if ephemeral is true, we cannot react to the messag
  return await interaction.editReply({
    ephemeral: true,
    files: [attachment],
  });
};
