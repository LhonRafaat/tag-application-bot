import { getButton } from "../UI/button.js";
import { getApplicationsEmbed } from "../UI/embeds/applicationsEmbed.js";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { isMod } from "../utils/isMod.js";

export async function getApplication(interaction, settings) {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }

  await interaction.editReply({
    embeds: [getApplicationsEmbed()],
    components: [
      getButton([
        new ButtonBuilder()
          .setCustomId(`open-ticket`)
          .setStyle(ButtonStyle.Primary)
          .setLabel("Open Ticket")
          .setEmoji("📨"),
      ]),
    ],
  });
}
