import { setRequiredPoints } from "../services/settingService.js";
import { isMod } from "../utils/isMod.js";

export const setPoints = async (interaction, settings) => {
  // check user if is head admin or founder
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  // here we should check that only admins could do that
  const points = await interaction.options.getNumber("points");
  await setRequiredPoints(points);
  return await interaction.editReply({ content: "okay", ephemeral: true });
};
