import { isMod } from "../utils/isMod.js";

export const closeTicket = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  if (
    interaction.channel.parentId === settings[0].ticketsParentId &&
    interaction.channel.name.startsWith("ticket-")
  ) {
    await interaction.channel.delete();
  } else {
    return interaction.editReply({
      content: "You can only delete tickets subchannels",
      ephemeral: true,
    });
  }
};
