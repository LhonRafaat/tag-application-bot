import { ButtonBuilder, ButtonStyle } from "discord.js";
import { getButton } from "../UI/button.js";

export const getRegister = async (interaction, settings) => {
  const isAuthorized = await interaction.member.roles.cache.find((role) => {
    return [
      settings[0].founderId,
      settings[0].headAdminId,
      settings[0].modId,
    ].includes(role.id);
  });
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
