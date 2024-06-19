import { ButtonBuilder, ButtonStyle } from "discord.js";
import { getButton } from "../UI/button.js";
import { isMod } from "../utils/isMod.js";

export const getRegister = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }
  await interaction.editReply({
    content: "Please register by clicking the green button below.",
    components: [
      getButton([
        new ButtonBuilder()
          .setCustomId("registerButton")
          .setLabel("Register")
          .setStyle(ButtonStyle.Success),
      ]),
    ],
  });
};
