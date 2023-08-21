import { findOne } from "../services/memberService.js";
import { getStrikes } from "../services/strikeService.js";
import { isMod } from "../utils/isMod.js";

export const getMemberStrikes = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  const username = interaction.options.get("username");

  const member = await findOne(username.user?.id);

  try {
    return interaction.editReply(await getStrikes(member._id));
  } catch (error) {
    return interaction.editReply(error.toString());
  }
};
