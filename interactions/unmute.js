import { Mute } from "../schemas/mute.js";
import { isMod } from "../utils/isMod.js";

export const unmuteUser = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }

  await interaction.member.fetch();

  const muteDoc = await Mute.findOne({
    discordId: interaction.member?.id,
  });

  await interaction.member.roles.set(muteDoc.prevRoles);

  await muteDoc.delete();

  await interaction.editReply({
    content: "User muted successfully",
  });
};
