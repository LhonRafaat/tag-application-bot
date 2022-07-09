import { isMod } from "../utils/isMod.js";

export const getRequiredPoints = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  const requiredPoints = await getRequiredPoints();
  if (!requiredPoints)
    return await interaction.editReply("No required points set");
  await interaction.editReply({
    ephemeral: true,
    content: `Required points: ${await getRequiredPoints()}`,
  });
};
