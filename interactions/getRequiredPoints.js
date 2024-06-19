import { isMod } from "../utils/isMod.js";
import { getRequiredPoints as getRequiredPointsfromDB } from "../services/settingService.js";

export const getRequiredPoints = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  const requiredPoints = await getRequiredPointsfromDB();
  if (requiredPoints === undefined)
    return await interaction.editReply("No required points set");
  await interaction.editReply({
    ephemeral: true,
    content: `Required points: ${requiredPoints}`,
  });
};
