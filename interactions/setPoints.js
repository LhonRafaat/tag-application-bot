import { setRequiredPoints } from "../services/settingService.js";
import { isMod } from "../utils/isMod.js";

export const setPoints = async (interaction) => {
  // check user if is head admin or founder
  const isAuthorized = await isMod(interaction, setPoints);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  // here we should check that only admins could do that
  const points = await interaction.options.getNumber("points");
  setRequiredPoints(points);
  return points
    ? await interaction.editReply({ content: "okay", ephemeral: true })
    : await interaction.editReply({
        content: "bad request",
        ephemeral: true,
      });
};
